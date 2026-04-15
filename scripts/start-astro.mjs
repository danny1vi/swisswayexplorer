process.env.HOST ||= "0.0.0.0";
process.env.PORT ||= "80";

await import("../dist/server/entry.mjs");
