import json, sys

data = json.load(sys.stdin)
for f in data:
    for m in f.get('messages', []):
        if m.get('severity') == 2:
            print(f'{f["filePath"]}:{m["line"]}:{m["column"]} {m["message"]} [{m["ruleId"]}]')