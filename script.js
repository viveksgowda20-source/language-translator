const inputText = document.getElementById("inputText");
const outputText = document.getElementById("outputText");

const sourceLanguage = document.getElementById("sourceLanguage");
const targetLanguage = document.getElementById("targetLanguage");

const translateBtn = document.getElementById("translateBtn");
const swapBtn = document.getElementById("swapBtn");
const clearBtn = document.getElementById("clearBtn");

const copyBtn = document.getElementById("copyBtn");
const speakerBtn = document.getElementById("speakerBtn");
const micBtn = document.getElementById("micBtn");

const charCount = document.getElementById("charCount");
const status = document.getElementById("status");


// CHARACTER COUNTER

inputText.addEventListener("input", () => {

    const length = inputText.value.length;

    charCount.textContent = `${length} / 5000`;

});


// TRANSLATE FUNCTION

async function translateText() {

    const text = inputText.value.trim();

    const source = sourceLanguage.value;
    const target = targetLanguage.value;

    if (text === "") {

        alert("Please enter some text to translate.");

        return;
    }

    if (source === target && source !== "auto") {

        outputText.textContent = text;

        return;
    }

    translateBtn.disabled = true;

    translateBtn.textContent = "⏳ Translating...";

    status.textContent = "Translating...";

    outputText.textContent = "Please wait...";


    try {

        let sourceCode = source;

        // MyMemory uses language codes
        if (sourceCode === "auto") {
            sourceCode = "en";
        }

        const url =
            "https://api.mymemory.translated.net/get" +
            "?q=" + encodeURIComponent(text) +
            "&langpair=" + sourceCode + "|" + target;


        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Translation service unavailable");
        }

        const data = await response.json();

        if (
            data &&
            data.responseData &&
            data.responseData.translatedText
        ) {

            outputText.textContent =
                data.responseData.translatedText;

            status.textContent = "Translated ✓";

        } else {

            throw new Error("Translation failed");

        }

    } catch (error) {

        console.error(error);

        outputText.textContent =
            "Unable to translate right now. Please try again.";

        status.textContent = "Error";

    }

    translateBtn.disabled = false;

    translateBtn.textContent = "🌐 Translate";
}


// TRANSLATE BUTTON

translateBtn.addEventListener("click", translateText);


// CTRL + ENTER TO TRANSLATE

inputText.addEventListener("keydown", function(event) {

    if (event.ctrlKey && event.key === "Enter") {

        translateText();

    }

});


// SWAP LANGUAGES

swapBtn.addEventListener("click", () => {

    let source = sourceLanguage.value;
    let target = targetLanguage.value;

    if (source === "auto") {

        alert("Select a specific source language before swapping.");

        return;
    }

    sourceLanguage.value = target;

    targetLanguage.value = source;


    const input = inputText.value;

    const output = outputText.textContent;

    if (
        output !== "Your translation will appear here..." &&
        output !== "Please wait..."
    ) {

        inputText.value = output;

        outputText.textContent = input;

        charCount.textContent =
            `${output.length} / 5000`;

    }

});


// CLEAR

clearBtn.addEventListener("click", () => {

    inputText.value = "";

    outputText.textContent =
        "Your translation will appear here...";

    charCount.textContent = "0 / 5000";

    status.textContent = "Ready";

});


// COPY

copyBtn.addEventListener("click", async () => {

    const text = outputText.textContent;

    if (
        text === "" ||
        text === "Your translation will appear here..." ||
        text === "Please wait..."
    ) {

        return;
    }

    try {

        await navigator.clipboard.writeText(text);

        copyBtn.textContent = "✅ Copied";

        setTimeout(() => {

            copyBtn.textContent = "📋 Copy";

        }, 1500);

    } catch (error) {

        alert("Unable to copy text.");

    }

});


// TEXT TO SPEECH

speakerBtn.addEventListener("click", () => {

    const text = outputText.textContent;

    if (
        !text ||
        text === "Your translation will appear here..." ||
        text === "Please wait..."
    ) {

        return;
    }

    if (!("speechSynthesis" in window)) {

        alert("Text-to-speech is not supported in this browser.");

        return;
    }

    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(text);

    speech.lang = targetLanguage.value;

    speech.rate = 0.9;

    speech.pitch = 1;

    window.speechSynthesis.speak(speech);

});


// SPEECH RECOGNITION

const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

if (SpeechRecognition) {

    const recognition = new SpeechRecognition();

    recognition.continuous = false;

    recognition.interimResults = false;


    micBtn.addEventListener("click", () => {

        recognition.lang =
            sourceLanguage.value === "auto"
                ? "en-US"
                : getSpeechLanguage(sourceLanguage.value);

        recognition.start();

        micBtn.textContent = "🔴 Listening...";

    });


    recognition.onresult = function(event) {

        const speechText =
            event.results[0][0].transcript;

        inputText.value +=
            (inputText.value ? " " : "") +
            speechText;

        charCount.textContent =
            `${inputText.value.length} / 5000`;

    };


    recognition.onend = function() {

        micBtn.textContent = "🎤";

    };


    recognition.onerror = function() {

        micBtn.textContent = "🎤";

        alert("Microphone error. Please allow microphone access.");

    };

} else {

    micBtn.addEventListener("click", () => {

        alert(
            "Speech recognition is not supported in this browser. Try Google Chrome."
        );

    });

}


// SPEECH LANGUAGE CODES

function getSpeechLanguage(language) {

    const languages = {

        en: "en-US",

        hi: "hi-IN",

        kn: "kn-IN",

        te: "te-IN",

        ta: "ta-IN",

        ml: "ml-IN",

        bn: "bn-IN",

        mr: "mr-IN",

        gu: "gu-IN",

        pa: "pa-IN",

        ur: "ur-PK",

        fr: "fr-FR",

        de: "de-DE",

        es: "es-ES",

        it: "it-IT",

        pt: "pt-PT",

        ru: "ru-RU",

        ja: "ja-JP",

        ko: "ko-KR",

        "zh-CN": "zh-CN",

        ar: "ar-SA",

        tr: "tr-TR",

        nl: "nl-NL",

        pl: "pl-PL",

        uk: "uk-UA",

        vi: "vi-VN",

        id: "id-ID",

        th: "th-TH"

    };

    return languages[language] || "en-US";

}