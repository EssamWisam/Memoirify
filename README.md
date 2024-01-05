<img width="970" alt="image" src="https://github.com/EssamWisam/Memoirify/assets/49572294/a59e5758-4f6c-4637-bf68-b856c06ee48a">

# 📃 Memoirify


Memoirify is simply an online markdown feature that supports nice features such as:
- Instant rendering for common elements, drag-and-drop fot images and a dark theme
- Resize the text content of the editor to the width that suits you
- Quick text highlighting and switching with shortcuts (ctrl+num)
- Viewing PDFs side by side with the editor
- Magical features to preprocess text (e.g., what I like to call *streamlining text*)
- Allows you to download your current edit of the markdown or start by editing an existing one on your machine
  
To run
```
npm install → npm start → new terminal
cd server → pip install -r requirements.txt → python3 server.py
```

## 🚁 Demo
[Memoirify-Demo.webm](https://github.com/EssamWisam/Memoirify/assets/49572294/719ce37f-afaa-4a85-bf2f-a55e3064a5f0)

It's a general purpose editor but my motivation to build this was to implement the *streamlining text feature* as shown in the end of the video. This feature useful in two cases: 
(i), you want to read a paragraph while your brain consumes less ATP molecules in less time or (ii), you are looking to thoroughly study some text (e.g., for a review). 

Note that streamlining relies on text being well written for good results (e.g., good punctuation, low ambiguity, etc.). It's a simple approach without any deep learning or LLMs; although the later may be added in the future.


## 🔭 Future Work & Limitations

This project is currently a work in progress with an anticipated slow down. Some limitations that I may address in the long-term are:
- Prompt user for file name so it doesn't download as `markdown.md`
- Eliminate Regex from the streamline implementation (inefficient)
- Project should be dockerized for easier execution
- Streamlining may fail if the text is not raw (e.g., highlighted or has links) or has special characters (e.g., >)
- Current highlighting is a little buggy (e.g., highlighting backwards). Nontrivial to improve but got to keep trying.
- Introduce LLMs for better streamlining (especially indenting), summarization, restructuring and other features
- More error handling in the backend
