# Features

1. support multiple user defined groups
2. support multiple words inside a group
3. support highlighting contents across mulitple HTML tag, i.e. `<span>exam<b>ple</b></span>`

# TODO
1. calculate a contrast color for the highlighted text

# Demo
![highlighted demo](./demo.png?raw=true)

Reference:
- http://james.padolsey.com/javascript/replacing-text-in-the-dom-solved/
- http://stackoverflow.com/questions/2582831/how-can-i-highlight-the-text-of-the-dom-range-object
- https://chrome.google.com/webstore/detail/multi-highlight/pfgfgjlejbbpfmcfjhdmikihihddeeji

Icon:
- http://marketplace-images-production.s3-us-west-2.amazonaws.com/dojo/wp-content/uploads/2014/06/Marker_pen_icon.jpg

Bug:
- There may be change in DOM structure if the keyword spans across multi HTML tag.
- When page init, no content in body. Currently, hard-coded a delay, may investigate using MutationObserver() to solve it.


# Instal from Chrome Web Store
- https://chrome.google.com/webstore/detail/multi-highlight/pfgfgjlejbbpfmcfjhdmikihihddeeji
