import Link from "next/link";
import React from "react";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="tab">
        <Link href="/admin" >
          <a>Products</a>
        </Link>
        <Link href="/admin/variant" >
          <a>Variants</a>
        </Link>

        <Link href="/admin/order" >
          <a>Orders</a>
        </Link>

      </div>
      {children}
    </>
  );
}

export default Layout;
