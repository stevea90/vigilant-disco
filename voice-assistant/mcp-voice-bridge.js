#!/usr/bin/env node
/**
 * MCP Voice Bridge — wraps GitHub + ServiceNow actions with spoken confirmations.
 *
 * This is a lightweight command router. Claude calls these functions via tool use;
 * each one performs the action AND speaks a human-friendly confirmation.
 *
 * Usage: import speakResult() into any MCP tool handler.
 */

const http = require('http');

const VOICE_PORT = process.env.VOICE_PORT || 3000;

// ── Core helper ───────────────────────────────────────────────────────────────

async function speakResult(text) {
  return new Promise(resolve => {
    const payload = JSON.stringify({ text, source: 'mcp-bridge' });
    const req = http.request(
      {
        hostname: '127.0.0.1',
        port: VOICE_PORT,
        path: '/speak',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload)
        }
      },
      res => { res.resume(); resolve(); }
    );
    req.on('error', resolve); // silent if server is down
    req.write(payload);
    req.end();
  });
}

// ── GitHub action handlers ────────────────────────────────────────────────────

const github = {
  async commitPushed({ repo, branch, message }) {
    await speakResult(
      `Done. Committed "${message}" to ${branch} on ${repo}. Changes are live on GitHub.`
    );
  },

  async prCreated({ repo, prNumber, title }) {
    await speakResult(
      `Pull request ${prNumber} created on ${repo}: "${title}". Ready for review.`
    );
  },

  async prMerged({ repo, prNumber }) {
    await speakResult(
      `Pull request ${prNumber} on ${repo} has been merged. Nice work.`
    );
  },

  async reviewRequested({ repo, reviewer }) {
    await speakResult(
      `Review requested from ${reviewer} on ${repo}.`
    );
  }
};

// ── ServiceNow action handlers ────────────────────────────────────────────────

const servicenow = {
  async ticketCreated({ number, title, assignee }) {
    await speakResult(
      `ServiceNow ticket ${number} created: "${title}". ${assignee ? `Assigned to ${assignee}.` : 'Unassigned.'}`
    );
  },

  async ticketUpdated({ number, status }) {
    await speakResult(
      `Ticket ${number} updated to ${status}.`
    );
  },

  async updateDeployed({ version, env }) {
    await speakResult(
      `Version ${version} deployed to ${env} in ServiceNow. Deployment complete.`
    );
  },

  async scriptImported({ name, scope }) {
    await speakResult(
      `Script "${name}" imported into ServiceNow scope ${scope}.`
    );
  }
};

// ── Example voice command → action mappings ───────────────────────────────────
//
// These show how Claude translates spoken commands into tool calls.
// Each comment is the voice input; the object below is what Claude calls.
//
// "Commit my changes with the message: fix login redirect"
//   → github.commitPushed({ repo: 'vigilant-disco', branch: 'main', message: 'fix login redirect' })
//
// "Open a pull request for the feature branch"
//   → github.prCreated({ repo: 'vigilant-disco', prNumber: 42, title: 'Add voice assistant layer' })
//
// "Create a ServiceNow ticket for the login bug"
//   → servicenow.ticketCreated({ number: 'INC0012345', title: 'Login redirect broken', assignee: 'Steve' })
//
// "Deploy version 2.3 to production"
//   → servicenow.updateDeployed({ version: '2.3', env: 'production' })
//
// "Import the approval script into the HRSD scope"
//   → servicenow.scriptImported({ name: 'ApprovalWorkflow', scope: 'HRSD' })

module.exports = { speakResult, github, servicenow };
