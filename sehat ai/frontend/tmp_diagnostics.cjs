const ts = require('typescript');
const fs = require('fs');
const path = 'e:/sehat ai/sehat ai/frontend/src/routes/dashboard.tsx';
const source = fs.readFileSync(path, 'utf8');
const sf = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
if (sf.parseDiagnostics.length === 0) {
  console.log('no parse diagnostics');
} else {
  sf.parseDiagnostics.forEach(d => {
    const { line, character } = sf.getLineAndCharacterOfPosition(d.start);
    console.log(`${line+1}:${character+1} ${ts.flattenDiagnosticMessageText(d.messageText, ' ')}`);
  });
}