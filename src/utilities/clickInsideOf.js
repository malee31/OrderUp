export default function clickInsideOf(elem, clickEvent) {
	return elem === clickEvent.target || elem.contains(clickEvent.target);
}