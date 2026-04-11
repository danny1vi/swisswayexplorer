const execute = process.argv.includes("--execute");
const webhookUrl = process.env.COOLIFY_DEPLOY_HOOK_URL;

if (!webhookUrl) {
  console.error("Missing COOLIFY_DEPLOY_HOOK_URL.");
  process.exit(1);
}

function redactUrl(value) {
  try {
    const url = new URL(value);
    if (url.password) {
      url.password = "***";
    }
    if (url.username) {
      url.username = "***";
    }
    if (url.search) {
      url.search = "?redacted=true";
    }
    return url.toString();
  } catch {
    return "invalid-url";
  }
}

const payload = {
  source: "swisswayexplorer",
  trigger: execute ? "manual-execute" : "manual-check",
  timestamp: new Date().toISOString(),
};

if (!execute) {
  console.log(
    JSON.stringify(
      {
        ok: true,
        mode: "dry-run",
        webhookUrl: redactUrl(webhookUrl),
        payload,
      },
      null,
      2
    )
  );
  process.exit(0);
}

const response = await fetch(webhookUrl, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(payload),
});

const text = await response.text();

if (!response.ok) {
  console.error(
    JSON.stringify(
      {
        ok: false,
        status: response.status,
        statusText: response.statusText,
        response: text,
      },
      null,
      2
    )
  );
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      ok: true,
      status: response.status,
      webhookUrl: redactUrl(webhookUrl),
      response: text,
    },
    null,
    2
  )
);
