import {
    $applyNodeReplacement,
    DOMConversionMap,
    DOMExportOutput,
    ElementNode,
    LexicalEditor,
    LexicalNode,
    NodeKey,
    SerializedElementNode,
    Spread
  } from 'lexical'
  import { MdxJsxAttribute } from 'mdast-util-mdx-jsx'
  import { MDX_NODE_TYPES, htmlTags } from './MdastHTMLNode'
  
  
    
  
  export class GenericHTMLNode extends ElementNode {
    /** @internal */
    __tag
    __nodeType
    __attributes
  

  
    static clone(node) {
      return new GenericHTMLNode(node.__tag, node.__nodeType, node.__attributes, node.__key)
    }
  
    constructor(tag, type, attributes, key) {
      super(key)
      this.__tag = tag
      this.__nodeType = type
      this.__attributes = attributes
    }
  
    getTag() {
      return this.__tag
    }
  
    getNodeType() {
      return this.__nodeType
    }
  
    getAttributes() {
      return this.__attributes
    }
  
    updateAttributes(attributes) {
      const self = this.getWritable()
      self.__attributes = attributes
    }
  
    getStyle() {
      return this.__attributes.find((attribute) => attribute.name === 'style')?.value
    }
  
    // View
  
    createDOM() {
      const tag = this.__tag
      const element = document.createElement(tag)
      // take the attributes and apply them to the element
      this.__attributes.forEach((attribute) => {
        element.setAttribute(attribute.name, attribute.value)
      })
      return element
    }
  
    updateDOM(){
      return false
    }
  
    static importDOM() {
      // TODO: take the implementation of convertHeadingElement from headingsPlugin
      return {}
    }
  
    exportDOM(editor) {
      // TODO
      const { element } = super.exportDOM(editor)
  
      // this.getFormatType()
      /*
      if (element && isHTMLElement(element)) {
        if (this.isEmpty()) element.append(document.createElement('br'))
  
        const formatType = this.getFormatType()
        element.style.textAlign = formatType
  
        const direction = this.getDirection()
        if (direction) {
          element.dir = direction
        }
      }*/
  
      return {
        element
      }
    }
  
    static importJSON(serializedNode) {
      const node = $createGenericHTMLNode(serializedNode.tag, serializedNode.mdxType, serializedNode.attributes)
      node.setFormat(serializedNode.format)
      node.setIndent(serializedNode.indent)
      node.setDirection(serializedNode.direction)
      return node
    }
  
    exportJSON() {
      return {
        ...super.exportJSON(),
        tag: this.getTag(),
        attributes: this.__attributes,
        mdxType: this.__nodeType,
        version: 1
      }
    }
  
    /*
    // Mutation
    insertNewAfter(selection?: RangeSelection, restoreSelection = true): ParagraphNode | GenericHTMLNode {
      const anchorOffet = selection ? selection.anchor.offset : 0
      const newElement =
        anchorOffet > 0 && anchorOffet < this.getTextContentSize() ? $createHeadingNode(this.getTag()) : $createParagraphNode()
      const direction = this.getDirection()
      newElement.setDirection(direction)
      this.insertAfter(newElement, restoreSelection)
      return newElement
    }
  
    collapseAtStart(): true {
      const newElement = !this.isEmpty() ? $createHeadingNode(this.getTag()) : $createParagraphNode()
      const children = this.getChildren()
      children.forEach((child) => newElement.append(child))
      this.replace(newElement)
      return true
    }*/
  
    extractWithChild(){
      return true
    }
  
    isInline(){
      return this.__nodeType === 'mdxJsxTextElement'
    }
  }
  
  export function $createGenericHTMLNode(tag, type, attributes) {
    return $applyNodeReplacement(new GenericHTMLNode(tag, type, attributes))
  }
  
  export function $isGenericHTMLNode(node) {
    return node instanceof GenericHTMLNode
  }
  