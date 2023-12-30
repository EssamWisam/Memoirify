/**
 * Retrieves the currently selected text within the browser window.
 *
 * @returns {string} The selected text.
 */
export function getSelectedText() {
  var selectedText = "";
  var selection = window.getSelection();

  if (selection.rangeCount > 0) {
    var range = selection.getRangeAt(0);

    // Create a div element to contain the selected content
    var container = document.createElement("div");
    container.appendChild(range.cloneContents());

    // Traverse the container and collect text content with new lines
    selectedText = traverseNodes(container);
  }

  return selectedText;
}

/**
 * Recursively traverses the nodes of an HTML container, collecting text content along with new lines.
 *
 * @param {Node} node - The node to traverse.
 * @returns {string} The collected text content.
 */
function traverseNodes(node) {
  var text = "";

  // If it's a text node, append its content to the result
  if (node.nodeType === Node.TEXT_NODE) {
    text += node.nodeValue;
  } else {
    // If it's an element node, traverse its child nodes
    for (var i = 0; i < node.childNodes.length; i++) {
      text += traverseNodes(node.childNodes[i]);
    }

    // If it's a block-level element, add a new line
    if (isBlockElement(node)) {
      text += '\n\n';
    }
  }

  return text;
}

/**
 * Determines whether an HTML element is a block-level element.
 *
 * @param {Element} element - The HTML element to check.
 * @returns {boolean} True if the element is a block-level element, false otherwise.
 */
function isBlockElement(element) {
  var blockElements = ['P', 'DIV', 'BR', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'UL', 'OL', 'LI', 'HR', 'ADDRESS', 'BLOCKQUOTE', 'PRE', 'DL', 'DT', 'DD', 'TABLE', 'CAPTION', 'THEAD', 'TFOOT', 'TBODY', 'COLGROUP', 'COL', 'TR', 'TH', 'TD', 'FIELDSET', 'LEGEND', 'SECTION', 'article', 'aside', 'details', 'figcaption', 'figure', 'footer', 'header', 'hgroup', 'menu', 'nav', 'article', 'section'];
  return blockElements.includes(element.nodeName);
}

/**
 * Searches for occurrences of a specified substring in a given large string and transforms the first match.
 *
 * @param {string} largeString - The string in which to search for occurrences.
 * @param {string} smallString - The substring to find within largeString.
 * @param {Function} transformFunction - The function to apply to the first match found.
 * @param {Function} [callback=(res) => {}] - An optional callback function to execute after the transformation is complete.
 * @returns {string} The transformed string.
 */
export async function findAndTransform(largeString, smallString, transformFunction, callback = (res) => {}) {

  const trimmedSmallString = (smallString.trim()).replace(/[<>]/g, '');

  // Escape special characters in the trimmedSmallString 
  const escapedSmallString = trimmedSmallString.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  // Remove backslashes from largeString (not spotted in highlighted text)
  const stringWithoutBackslashes = (largeString.replace(/\\/g, '')).replace(/[<>]/g, '');

  // Use match with a regular expression to find all occurrences
  const matches = stringWithoutBackslashes.match(new RegExp(escapedSmallString, 'g')) || [];

  if (matches.length === 0) {
    console.log("No matches found");
    return largeString;
  }

  if (matches.length > 1) {
    console.warn("Multiple matches found. Operating on the first match.");
  }

  const lastMatch = matches[0];
  const transformedValue = await transformFunction(lastMatch);

  const result = stringWithoutBackslashes.replace(lastMatch, transformedValue);

  callback(result);
  return result;
}

