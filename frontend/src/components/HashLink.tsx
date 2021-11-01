import { forwardRef } from "react";
import { Link, LinkProps } from "react-router-dom";

function jumpToSection(e: HTMLElement) {
  e.scrollIntoView({ block: "center", behavior: "smooth" });
}
export default forwardRef<HTMLAnchorElement, LinkProps>((props, ref) => {
  const handleClick = () => {
    const id = props.to.toString().split("#")[1];
    id &&
      setTimeout(() => {
        let e = document.getElementById(id);
        if (e) {
          jumpToSection(e);
        } else {
          const observer = new MutationObserver(() => {
            e = document.getElementById(id);
            if (e) {
              jumpToSection(e);
              observer.disconnect();
              clearTimeout(timeoutId);
            }
          });
          observer.observe(document.body, {
            attributes: true,
            childList: true,
            subtree: true,
          });
          const timeoutId = setTimeout(() => {
            observer.disconnect();
          }, 10000);
        }
      }, 0);
  };
  return <Link {...props} ref={ref} onClick={handleClick} />;
});
