import React from 'react'
import { Link} from 'react-router-dom';
import useBreadcrumbs from "use-react-router-breadcrumbs";
import { MdArrowForwardIos } from "react-icons/md";






const Breadcrumb = ({title,category}) => {
    const routes = [
        { path: "/:category", breadcrumb: category },
        { path: "/", breadcrumb: "Trang chủ" },
        { path: "/:category/:pid/:title",breadcrumb: title}
      ];
    const breadcrumbs = useBreadcrumbs(routes);

  return (
    <div className='text-sm flex items-center gap-1'>
        {breadcrumbs?.filter(el=>!el.match.route===false).map(({ match, breadcrumb },index,self) => (
        <Link className='flex items-center capitalize gap-1' key={match.pathname} to={match.pathname}>
          <span>{breadcrumb}</span>
          {index !== self.length-1 && <MdArrowForwardIos />}
        </Link>
      ))}
    </div>
  )
}

export default Breadcrumb