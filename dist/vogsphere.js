/*
==========
VOGSPHERE
The Claim Code Generator
A Magrathea project
https://github.com/magratheaguide/vogsphere
-----
Purpose:
Convert member-provided answers from the associated form into the code admins need to update the various claims lists.

How To Guide:
https://github.com/magratheaguide/vogsphere/docs/01-getting-started.md
==========
*/
(function () {
    "use strict";

    const runBtn = document.getElementById("js-vogsphere__run");

    // get a handle on the place the resulting code needs to go
    const resultBox = document
        .getElementById("js-vogsphere__result")
      .querySelector("code"); // TODO: demo version, comment out when actually using
    // .querySelector("td#code"); // TODO: real version, works with Jcink's [code] tags //

    const formId = runBtn.getAttribute("form");
    const form = document.getElementById(formId);

    const newline = "\n";

    // doHTML codes
    // square brackets must be escaped or else they get processed right away by Jcink
    const leftBracket = "&#91;";
    const rightBracket = "&#93;";

    function openDohtml(tag) {
        return `${leftBracket}${tag}${rightBracket}`;
    } // returns [tag]
    function openEqualsDohtml(tag, param) {
        return `${leftBracket}${tag}="${param}"${rightBracket}`;
    } // returns [tag=param]
    function closeDohtml(tag) {
        return `${leftBracket}/${tag}${rightBracket}`;
    } // returns [/tag]

    const postBbcodeName = "BASICPOST"; // TODO: should be the name of your site's default bbcode for posting

    const postBbcodeOpen = openDohtml(postBbcodeName);
    const postBbcodeClose = closeDohtml(postBbcodeName);

    const codeBbcodeOpen = openDohtml("code");
    const codeBbcodeClose = closeDohtml("code");

    function formatBold(content) {
        return `${openDohtml("b")}${content}${closeDohtml("b")}`;
    }
    function formatUrl(address) {
        return `${openEqualsDohtml("url", `${address}`)}${address}${closeDohtml(
            "url"
        )}`;
    }

    // TODO: names of form fields (as specified by the "name" attribute in the html)
    const expectedFormFields = {
        text: [
            "siteName",
            "siteLink",
            "siteIcon",
        ],
    };
    let input = {};
    let errors = [];

    // how text fields are processed
    class textInput {
        constructor(name) {
            this.value = form.elements[name].value;
            this.required = form.elements[name].required;
        }
    }

    // how boolean fields are processed
    class boolInput {
        constructor(name) {
            this.value = form.elements[name].value === "true";
        }
    }

    // TODO: update/create classes to match the actual claim codes needed for the site
    class fullPost {
        constructor(
            siteName,
            siteIcon,
            siteLink
        ) {
            this.code = `<a href="${siteLink}" title="${siteName}"><img src="${siteIcon}"></img></a>`;
        }
    }


    // TODO: update to create the post you want members to reply with
    class claimPost {
        constructor(
            fullPost
        ) {
            // prettier-ignore
            this.content = `${postBbcodeOpen}
Code to post:
${codeBbcodeOpen}${fullPost.code}${codeBbcodeClose}
${postBbcodeClose}`;
        }
    }

    function isInForm(name) {
        return !!form.elements[name];
    }

    function resetGenerator() {
        // clear any past results
        resultBox.innerHTML = "";

        // clear past errors
        errors = [];
    }

    function getInput() {
        for (const type in expectedFormFields) {
            expectedFormFields[type].forEach((fieldName) => {
                if (!isInForm(fieldName)) {
                    errors.push(
                        `ERROR: Could not find field with name "${fieldName}" in form. Contact admin`
                    );
                } else {
                    switch (type) {
                        case "text":
                            input[fieldName] = new textInput(fieldName);
                            break;
                        case "bool":
                            input[fieldName] = new boolInput(fieldName);
                            break;
                        default:
                            errors.push(
                                `ERROR: Form field type "${type}" is unsupported. Contact admin`
                            );
                            break;
                    }
                }
            });
        }
    }

    function validateInput() {
        // check that required input is present
        for (const x in input) {
            if (input[x].required && !input[x].value) {
                errors.push(`ERROR: Missing ${x}`);
            }
        }

       


    // TODO: list all the different claims you need and the pieces they need to be filled in
    function fillInClaims() {
        let completefullPost = new fullPost(
            input.siteName.value,
            input.siteLink.value,
            input.siteIcon.value
        );
       
        return {
            fullPost: completeFullPost,
        };
    }



    function generateClaim() {
        let claims;
        let post;

        resetGenerator();

        getInput();

        validateInput();

        // stop if input errors were found
        if (errors.length > 0) {
            errors.forEach(
                (element) => (resultBox.textContent += element + newline)
            );
            return;
        }

        claims = fillInClaims();

        resultBox.textContent = post;
        return;
    }

    runBtn.addEventListener("click", generateClaim, false);
})();
