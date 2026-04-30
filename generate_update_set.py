#!/usr/bin/env python3
"""Regenerate SDLC_AI_Orchestrator_UpdateSet.xml from dist files + manually-created entries."""
import os, re, html, uuid
from xml.etree import ElementTree as ET

DIST_UPDATE = 'dist/app/update'
DIST_SCOPE  = 'dist/app/scope'
EXISTING    = 'SDLC_AI_Orchestrator_UpdateSet.xml'
OUTPUT      = 'SDLC_AI_Orchestrator_UpdateSet.xml'
UPDATE_SET_ID = 'c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0'
APP_ID        = 'e4c0cddd93e04310c7a5f3255d03d619'
TIMESTAMP     = '2026-04-29 10:34:19'

def html_escape(s):
    return html.escape(s, quote=False)

def get_type_from_name(name):
    # extract table name prefix from update name like sys_ui_action_abc123
    parts = name.split('_')
    # find the sys_id suffix (32-char hex) and strip it
    for i in range(len(parts)-1, 0, -1):
        candidate = '_'.join(parts[i:])
        if re.match(r'^[0-9a-f]{32}$', candidate):
            return '_'.join(parts[:i])
    return name

# --- Load existing update set to harvest wrapper sys_ids and manual entries ---
existing_text = open(EXISTING).read()
# Extract all sys_update_xml blocks
block_pattern = re.compile(r'<sys_update_xml action="INSERT_OR_UPDATE">(.*?)</sys_update_xml>', re.DOTALL)
blocks = block_pattern.findall(existing_text)

name_to_wrapper_id = {}
manual_entries = {}  # name -> full block text
for block in blocks:
    name_m = re.search(r'<name>(.*?)</name>', block)
    id_m   = re.search(r'<sys_id>(.*?)</sys_id>', block)
    if name_m and id_m:
        name = name_m.group(1)
        wid  = id_m.group(1)
        name_to_wrapper_id[name] = wid
        # Keep manually-created entries (no corresponding dist file)
        if name.startswith('sys_db_object_') or name.startswith('sys_dictionary_'):
            manual_entries[name] = block

def make_entry(name, file_content, wrapper_id=None):
    if wrapper_id is None:
        wrapper_id = name_to_wrapper_id.get(name) or uuid.uuid4().hex
    rec_type = get_type_from_name(name)
    payload  = html_escape(file_content)
    return f'''<sys_update_xml action="INSERT_OR_UPDATE">
    <sys_id>{wrapper_id}</sys_id>
    <action>INSERT_OR_UPDATE</action>
    <application display_value="SDLC AI Orchestrator">{APP_ID}</application>
    <category>customer</category>
    <name>{name}</name>
    <payload>{payload}</payload>
    <remote_update_set display_value="SDLC AI Orchestrator">{UPDATE_SET_ID}</remote_update_set>
    <replace_on_upgrade>false</replace_on_upgrade>
    <state>current</state>
    <sys_class_name>sys_update_xml</sys_class_name>
    <sys_created_by>admin</sys_created_by>
    <sys_created_on>{TIMESTAMP}</sys_created_on>
    <sys_mod_count>0</sys_mod_count>
    <sys_updated_by>admin</sys_updated_by>
    <sys_updated_on>{TIMESTAMP}</sys_updated_on>
    <type>{rec_type}</type>
    <update_set display_value="SDLC AI Orchestrator">{UPDATE_SET_ID}</update_set>
</sys_update_xml>'''

GLOBAL_ATF_HELPER_SI_ID   = 'b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6'
GLOBAL_ATF_HELPER_NAME    = 'sys_script_include_' + GLOBAL_ATF_HELPER_SI_ID
GLOBAL_UPDATE_SET_ID      = 'f0e1d2c3b4a5f6e7d8c9b0a1f2e3d4c5'
GLOBAL_UPDATE_SET_OUTPUT  = 'SDLC_AI_ATFHelper_Setup.xml'

def generate_global_helper_update_set():
    script = open('src/SDLC_AI_ATFHelper.js').read()
    script_escaped = html_escape(script)
    payload_xml = f'''<?xml version="1.0"?>
<record_update table="sys_script_include">
  <sys_script_include action="INSERT_OR_UPDATE">
    <sys_id>{GLOBAL_ATF_HELPER_SI_ID}</sys_id>
    <sys_scope/>
    <sys_update_name>{GLOBAL_ATF_HELPER_NAME}</sys_update_name>
    <access>public</access>
    <active>true</active>
    <api_name>SDLC_AI_ATFHelper</api_name>
    <caller_access/>
    <client_callable>false</client_callable>
    <description>Global ATF helper for SDLC AI Orchestrator - creates ATF records from global scope to bypass cross-scope restrictions</description>
    <mobile_callable>false</mobile_callable>
    <name>SDLC_AI_ATFHelper</name>
    <sandbox_callable>false</sandbox_callable>
    <script>{script_escaped}</script>
  </sys_script_include>
</record_update>'''

    wrapper_id = GLOBAL_ATF_HELPER_SI_ID[::-1]  # reversed = stable unique id
    entry = f'''<sys_update_xml action="INSERT_OR_UPDATE">
    <sys_id>{wrapper_id}</sys_id>
    <action>INSERT_OR_UPDATE</action>
    <application/>
    <category>customer</category>
    <name>{GLOBAL_ATF_HELPER_NAME}</name>
    <payload>{html_escape(payload_xml)}</payload>
    <remote_update_set display_value="SDLC AI ATFHelper Setup">{GLOBAL_UPDATE_SET_ID}</remote_update_set>
    <replace_on_upgrade>false</replace_on_upgrade>
    <state>current</state>
    <sys_class_name>sys_update_xml</sys_class_name>
    <sys_created_by>admin</sys_created_by>
    <sys_created_on>{TIMESTAMP}</sys_created_on>
    <sys_mod_count>0</sys_mod_count>
    <sys_updated_by>admin</sys_updated_by>
    <sys_updated_on>{TIMESTAMP}</sys_updated_on>
    <type>sys_script_include</type>
    <update_set display_value="SDLC AI ATFHelper Setup">{GLOBAL_UPDATE_SET_ID}</update_set>
</sys_update_xml>'''

    content = f'''<?xml version="1.0" encoding="UTF-8"?>
<unload unload_date="{TIMESTAMP}">

<sys_remote_update_set action="INSERT_OR_UPDATE"><sys_id>{GLOBAL_UPDATE_SET_ID}</sys_id><application/><collisions/><commit_date/><description>Global Script Include for SDLC AI Orchestrator ATF creation - import this BEFORE the main update set</description><inserted>0</inserted><name>SDLC AI ATFHelper Setup</name><origin_sys_id/><parent/><remote_base_update_set/><replaced>0</replaced><retrieved_from/><state>loaded</state><summary/><sys_class_name>sys_remote_update_set</sys_class_name><sys_created_by>admin</sys_created_by><sys_created_on>{TIMESTAMP}</sys_created_on><sys_mod_count>0</sys_mod_count><sys_updated_by>admin</sys_updated_by><sys_updated_on>{TIMESTAMP}</sys_updated_on><type>Standard</type><update_set/><updates>1</updates><version/></sys_remote_update_set>

{entry}

</unload>
'''
    with open(GLOBAL_UPDATE_SET_OUTPUT, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'Generated {GLOBAL_UPDATE_SET_OUTPUT} (1 entry).')

generate_global_helper_update_set()

entries = []

# 1. sys_app from scope file
for fn in os.listdir(DIST_SCOPE):
    if fn.endswith('.xml'):
        name = fn[:-4]  # strip .xml
        content = open(os.path.join(DIST_SCOPE, fn)).read()
        entries.append(make_entry(name, content))

# 2. Manual entries (sys_db_object + sys_dictionary)
for name, block in manual_entries.items():
    entries.append(f'<sys_update_xml action="INSERT_OR_UPDATE">{block}</sys_update_xml>')

# 3. All dist/update files
for fn in sorted(os.listdir(DIST_UPDATE)):
    if fn.endswith('.xml'):
        name = fn[:-4]
        content = open(os.path.join(DIST_UPDATE, fn)).read()
        entries.append(make_entry(name, content))

total = len(entries)

header = f'''<?xml version="1.0" encoding="UTF-8"?>
<unload unload_date="{TIMESTAMP}">

<sys_remote_update_set action="INSERT_OR_UPDATE"><sys_id>{UPDATE_SET_ID}</sys_id><application display_value="SDLC AI Orchestrator">{APP_ID}</application><collisions/><commit_date/><description>AI-powered SDLC automation</description><inserted>0</inserted><name>SDLC AI Orchestrator</name><origin_sys_id/><parent/><remote_base_update_set/><replaced>0</replaced><retrieved_from/><state>loaded</state><summary/><sys_class_name>sys_remote_update_set</sys_class_name><sys_created_by>admin</sys_created_by><sys_created_on>{TIMESTAMP}</sys_created_on><sys_mod_count>0</sys_mod_count><sys_updated_by>admin</sys_updated_by><sys_updated_on>{TIMESTAMP}</sys_updated_on><type>Standard</type><update_set/><updates>{total}</updates><version/></sys_remote_update_set>
'''

footer = '\n</unload>\n'

with open(OUTPUT, 'w', encoding='utf-8') as f:
    f.write(header)
    for e in entries:
        f.write('\n' + e + '\n')
    f.write(footer)

print(f'Generated {OUTPUT} with {total} entries.')
