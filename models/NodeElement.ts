class NodeElement {
  id: number;
  title: string;
  elements: NodeElement[];
  content?: any;
  image?: boolean;
  color?: string;

  constructor(
    id: number,
    title: string,
    elements: NodeElement[],
    content?: any,
    image: boolean = false,
    color: string = "#B4B6FF"
  ) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.image = image;
    this.elements = elements ? elements : [];
    this.color = color;
  }
}

export default NodeElement;
