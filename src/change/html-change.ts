import { Attribute, Element } from '@angular/compiler';
import { DeleteChange, InsertChange, ReplaceChange } from './content-change';
export class HtmlChange {
    constructor() {}
    replaceTagName(element: Element, tagName: string) {
        return [
            new ReplaceChange(element.startSourceSpan.start.offset + 1, element.name.length, tagName),
            new ReplaceChange(element.endSourceSpan.start.offset + 2, element.name.length, tagName),
        ];
    }
    replaceTag(element: Element, content: string) {
        let start = element.startSourceSpan.start.offset;
        return new ReplaceChange(start, element.endSourceSpan.end.offset - start, content);
    }
    deleteTag(element: Element) {
        let start = element.startSourceSpan.start.offset;
        return new DeleteChange(start, element.endSourceSpan.end.offset - start);
    }
    insertTag(element: Element, content: string, position: 'beforebegin' | 'afterbegin' | 'beforeend' | 'afterend' = 'beforebegin') {
        if (position === 'beforebegin') {
            return new InsertChange(element.startSourceSpan.start.offset, content);
        } else if (position === 'afterbegin') {
            return new InsertChange(element.startSourceSpan.end.offset, content);
        } else if (position === 'beforeend') {
            return new InsertChange(element.endSourceSpan.start.offset, content);
        } else if (position === 'afterend') {
            return new InsertChange(element.endSourceSpan.end.offset, content);
        }
    }
    insertTagAttribute(element: Element, content: string) {
        return new InsertChange(element.startSourceSpan.end.offset - 1, ' ' + content);
    }
    deleteTagAttribute(element: Element, attributeName: string) {
        let attribute = element.attrs.find((item) => item.name === attributeName);
        let start = attribute.sourceSpan.start.offset;
        return new DeleteChange(start, attribute.sourceSpan.end.offset - start);
    }
    replaceTagAttribute(element: Attribute, content: string) {
        return new ReplaceChange(element.sourceSpan.start.offset, element.sourceSpan.end.offset - element.sourceSpan.start.offset, content);
    }
    setTagAttribute(element: Element, content: string) {
        let start = element.startSourceSpan.start.offset + element.name.length + 1;
        return new ReplaceChange(start, element.startSourceSpan.end.offset - start - 1, ' ' + content);
    }
}
