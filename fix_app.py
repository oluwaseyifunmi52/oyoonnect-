with open('src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

old = """            {/* MESSAGES LAYOUT - Messages */}
            <Route element={<ProtectedRoute><MessagesLayout /></ProtectedRoute>}>
              <Route path="/messages" element={<ComingSoon feature="Messages" description="Direct messages from businesses and support are being developed. You'll be able to chat securely from this dashboard." />} />
            </Route>"""

new = """            {/* MESSAGES LAYOUT - Messages */}
            <Route element={<ProtectedRoute><MessagesLayout /></ProtectedRoute>}>
              <Route path="/messages" element={<MessagesLandingPage />} />
              <Route path="/messages/:conversationId" element={<ConversationPage />} />
            </Route>"""

if old in content:
    content = content.replace(old, new)
    with open('src/App.tsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print('SUCCESS: Replacement done')
else:
    print('FAILED: Old string not found')
    lines = content.split('\n')
    for i in range(313, 320):
        print(f'Line {i+1}: {repr(lines[i])}')