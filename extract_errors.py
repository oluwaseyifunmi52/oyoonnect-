import json

with open('lint-output.json') as f:
    data = json.load(f)

errors = []
for file_data in data:
    for msg in file_data.get('messages', []):
        if msg.get('severity') == 2:
            errors.append(f'{file_data["filePath"]}:{msg["line"]}:{msg["column"]} {msg["message"]} [{msg["ruleId"]}]')

for e in errors:
    print(e)
print(f"\nTotal errors: {len(errors)}")