import * as vscode from "vscode"
import { rainborColors } from "./rainbow";

let colors = Array.from(rainborColors)

export function decorate() {
    let editor = vscode.window.activeTextEditor;
    let text = editor.document.getText()
    let rainbows = colors.map(x => vscode.window.createTextEditorDecorationType({ color: x }))
    let regex = /"(.*?)"/g
    let decorators = colors.map(color => [])
    let match: RegExpMatchArray;

    while ((match = regex.exec(text))) {
        let chars = [...match[1]]

        if (chars.length > 0) {
            chars.forEach((_, i) => {
                // match.index points to the " char; we want to start at the text inside
                var matchIndex = match.index + 1
                
                // Create range spanning one character
                let start = editor.document.positionAt(matchIndex + i)
                let end   = editor.document.positionAt(matchIndex + i + 1)
                decorators[i % colors.length].push(new vscode.Range(start, end))
            });
        }
    }
    decorators.forEach((d, index) => {
        editor.setDecorations(rainbows[index], d)
    })
}
