import { createCssSelectorForXml } from './css-selector-for-xml';
import { AttributeContext, ContentContext, ElementContext, XMLParser } from './xml/XMLParser';

const mockHtml = `<?xml version="1.0" encoding="ISO-8859-1" ?>

<web-app xmlns="http://java.sun.com/xml/ns/j2ee"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://java.sun.com/xml/ns/j2ee http://java.sun.com/xml/ns/j2ee/web-app_2_4.xsd"
    version="2.4">

    <display-name>HelloWorld Application</display-name>
    <description>
        This is a simple web application with a source code organization
        based on the recommendations of the Application Developer's Guide.
    </description>

    <servlet value="20">
        <servlet-name id="mock">HelloServlet</servlet-name>
        <servlet-class>examples.Hello</servlet-class>
    </servlet>

    <servlet-mapping>
        <servlet-name>HelloServlet</servlet-name>
        <url-pattern>/hello</url-pattern>
    </servlet-mapping>

</web-app>`;
describe('用于ts node的css选择器', () => {
    it('初始化', () => {
        let cssSelector = createCssSelectorForXml(mockHtml);
        expect(cssSelector).toBeTruthy();
    });
    it('标签查询', () => {
        let cssSelector = createCssSelectorForXml(mockHtml);
        let result = cssSelector.queryAll('servlet-name');
        // console.log(result)
        expect(result.length).toBe(2);
    });
    it('~', () => {
        let cssSelector = createCssSelectorForXml(mockHtml);
        let result = cssSelector.queryAll('display-name~description');

        expect(result.length).toBe(1);
        expect(result[0].Name(0).text === 'description').toBeTrue();
    });
    it('>', () => {
        let cssSelector = createCssSelectorForXml(mockHtml);
        let result = cssSelector.queryAll('servlet-mapping>servlet-name');

        expect(result.length).toBe(1);
        expect(result[0].Name(0).text === 'servlet-name').toBeTrue();
    });
    it(',', () => {
        let cssSelector = createCssSelectorForXml(mockHtml);
        let result = cssSelector.queryAll('servlet,servlet-name');

        expect(result.length).toBe(3);
    });
    it('attribute equal', () => {
        let cssSelctor = createCssSelectorForXml(mockHtml);
        let result = cssSelctor.queryAll('servlet-name[id=mock]');

        expect(result.length).toBe(1);
        expect(result[0].Name(0).text === 'servlet-name').toBeTruthy();
        // 这里解析出的token是带""，所以手动拼上""，需要注意
        expect(result[0].attribute().find((item) => item.Name().text == 'id' && item.STRING().text == '"mock"')).toBeTruthy();
    });
    it('attribute exist', () => {
        let cssSelector = createCssSelectorForXml(mockHtml);
        let result = cssSelector.queryAll('servlet-name[id]');

        expect(result.length).toBe(1);
        expect(result[0].Name(0).text === 'servlet-name').toBeTruthy();
        expect(result[0].attribute().find((item) => item.Name().text == 'id')).toBeTruthy();
    });
    it('attribute any', () => {
        let cssSelector = createCssSelectorForXml(mockHtml);
        let result = cssSelector.queryAll('servlet-name[id*=mo]');

        expect(result.length).toBe(1);
        expect(result[0].Name(0).text === 'servlet-name').toBeTruthy();
        expect(result[0].attribute().find((item) => item.Name().text == 'id')).toBeTruthy();
    });
    it('#id', () => {
        let cssSelector = createCssSelectorForXml(mockHtml);
        let result = cssSelector.queryAll('#mock');
        expect(result.length).toBe(1);
        expect(result[0].Name(0).text === 'servlet-name').toBeTruthy();
        expect(result[0].attribute().find((item) => item.Name().text == 'id' && item.STRING().text == '"mock"')).toBeTruthy();
    });
    it('通过返回的element进行查询', () => {
        let cssSelector = createCssSelectorForXml(mockHtml);
        let result = cssSelector.queryAll('web-app > servlet');
        expect(result.length).toBe(1);
        result = cssSelector.queryAll(result[0], 'servlet-name');
        expect(result.length).toBe(1);
        expect(result[0].Name(0).text).toBe('servlet-name');
    });
    it('a b c', () => {
        let cssSelector = createCssSelectorForXml(mockHtml);
        let result = cssSelector.queryAll('web-app servlet servlet-name');
        expect(result.length).toBe(1);
        expect(result[0].Name(0).text === 'servlet-name').toBeTruthy();
    });
    it('复杂选择', () => {
        let cssSelector = createCssSelectorForXml(mockHtml);
        let result = cssSelector.queryAll('servlet[value=20] > servlet-name#mock');
        expect(result.length).toBe(1);
        expect(result[0].Name(0).text === 'servlet-name').toBeTruthy();
    });
    it('不应该选中', () => {
        let cssSelector = createCssSelectorForXml(mockHtml);

        expect(cssSelector.queryAll('servlet-mapping [value=20]').length).toBe(0);
        expect(cssSelector.queryAll('servlet-mapping #mock').length).toBe(0);
        expect(cssSelector.queryAll('servlet-mapping>#mock').length).toBe(0);
        expect(cssSelector.queryAll('servlet-mapping+#mock').length).toBe(0);
        expect(cssSelector.queryAll('servlet-mapping~#mock').length).toBe(0);
    });
    it('*', () => {
        let cssSelector = createCssSelectorForXml(mockHtml);
        // cssSelector.queryAll('*').forEach(item => console.log(item.Name(0).text))
        expect(cssSelector.queryAll('*').length).toBe(9);
        expect(cssSelector.queryAll('servlet *').length).toBe(2);
    });
    it('解析失败抛出异常', () => {
        try {
            createCssSelectorForXml(`<div <div>`);
        } catch (error) {
            return expect(error).toBeTruthy();
        }
    });
});
