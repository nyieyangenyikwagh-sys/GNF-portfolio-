import assert from "node:assert/strict";
import vm from "node:vm";
import { readFile, writeFile } from "node:fs/promises";
import ts from "typescript";
const shared = ts.transpileModule(await readFile("lib/contact.ts", "utf8"), {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2022,
  },
}).outputText;
const sharedContext = { exports: {} };
vm.runInNewContext(shared, sharedContext);
const { validateInquiry } = sharedContext.exports;
const input = {
  name: "QA Visitor",
  email: "qa@example.invalid",
  organization: "",
  message: "Synthetic local test only.",
  website: "",
};
assert.equal(Object.keys(validateInquiry(input)).length, 0);
assert.equal(validateInquiry({ ...input, name: "" }).name, "required");
assert.equal(
  validateInquiry({ ...input, email: "invalid" }).email,
  "invalidEmail",
);
assert.equal(
  validateInquiry({ ...input, message: "x".repeat(5001) }).message,
  "tooLong",
);
const routeCode = ts.transpileModule(
  await readFile("app/api/contact/route.ts", "utf8"),
  {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  },
).outputText;
let providerCalls = 0,
  providerBody;
const config = {
  contact: { mode: "resend" },
  ui: {
    form: {
      subject: "QA ONLY",
      name: "Name",
      email: "Email",
      organization: "Organization",
    },
  },
};
const environment = {
  RESEND_API_KEY: "synthetic-local-key",
  CONTACT_FROM_EMAIL: "from@example.invalid",
  CONTACT_TO_EMAIL: "to@example.invalid",
};
const context = {
  exports: {},
  process: { env: environment },
  URL,
  AbortSignal,
  require: (name) => {
    if (name === "next/server")
      return {
        NextResponse: {
          json: (body, options = {}) =>
            new Response(JSON.stringify(body), {
              status: options.status || 200,
            }),
        },
      };
    if (name === "@/data/portfolio") return { portfolio: config };
    if (name === "@/lib/contact") return sharedContext.exports;
    throw new Error(`Unexpected dependency: ${name}`);
  },
  fetch: async (_url, options) => {
    providerCalls++;
    providerBody = JSON.parse(options.body);
    return new Response('{"id":"synthetic"}', { status: 200 });
  },
};
vm.runInNewContext(routeCode, context);
const post = (body, origin = "http://localhost:3000") =>
  context.exports.POST(
    new Request("http://localhost:3000/api/contact", {
      method: "POST",
      headers: { origin, "content-type": "application/json" },
      body: typeof body === "string" ? body : JSON.stringify(body),
    }),
  );
assert.equal((await post({ ...input, website: "bot" })).status, 200);
assert.equal(providerCalls, 0);
assert.equal((await post({ ...input, email: "invalid" })).status, 400);
assert.equal(providerCalls, 0);
assert.equal((await post(input, "https://elsewhere.invalid")).status, 403);
assert.equal((await post("invalid-json")).status, 400);
assert.equal(
  (await post({ ...input, message: "x".repeat(21000) })).status,
  413,
);
assert.equal((await post(input)).status, 200);
assert.equal(providerCalls, 1);
assert.equal(providerBody.reply_to, input.email);
config.contact.mode = "mailto";
assert.equal((await post(input)).status, 503);
assert.equal(providerCalls, 1);
const report =
  "Contact validation, honeypot, origin, malformed JSON, size limit, mocked provider payload and disabled-mode tests PASS. No network requests or messages sent.";
await writeFile(".tools/contact-tests.txt", report);
console.log(report);
