const fs = require("fs");
const util = require("util");
const cors = require("cors");
const express = require("express");
const exec = util.promisify(require("child_process").exec);

const PORT = 80;
const app = express();

app.use(cors());
app.use(express.json());


app.post("/java", (req, res) => {
    const code = req.body.code;
    const input = req.body.input || "";

    // Save the Java code to a file
    fs.writeFileSync('Main.java', code);

    // Save the input to a separate file
    fs.writeFileSync('input.txt', input);

    // Compile the Java code using the child_process module
    exec(`javac Main.java`, (compileError, compileStdout, compileStderr) => {
        if (compileError) {
            console.error(`Compilation error: ${compileError.message}`);
            return res.status(500).json({ errors: compileError.message });
        }

        // Execute the compiled Java code with input redirection
        exec(`java Main < input.txt`, (runError, runStdout, runStderr) => {
            // Delete the temporary files
            fs.unlinkSync('Main.java');
            fs.unlinkSync('input.txt');
            if (runError) {
                console.error(`Error during execution: ${runError.message}`);
                return res.status(500).json({ errors: runError.message });
            }
            const output = runStdout.toString();
            const errors = runStderr.toString();
            console.log(`Output: ${output}`);
            console.log(`Errors: ${errors}`);

            if (errors.trim() !== "") {
                return res.status(400).json({ errors });
            }
            res.json({ output });
        });
    });
});


app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
