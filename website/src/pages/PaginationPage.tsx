import { useState } from "react";
import { Demo } from "../components/Demo.tsx";
import { ApiProps } from "../components/ApiProps.tsx";
import { useMaoEvents } from "../useMaoEvents.ts";

export function PaginationPage() {
  const [page, setPage] = useState(1);
  const ref = useMaoEvents<HTMLElement>({
    "mt-change": (event) => setPage(Number(event.detail.page ?? 1)),
  });

  return (
    <>
      <h1>分页</h1>
      <pre className="demo-code">import "maotaui";</pre>
      <p className="demo-note">
        按 total / page-size 计算页数，中间页码自动折叠；切换时改动 page 属性并派发 mt-change。
      </p>

      <h2>基础用法</h2>
      <Demo
        code={`<mao-pagination total="128" page="1" page-size="10"></mao-pagination>`}
      >
        <mao-pagination ref={ref} total="128" page={page} page-size="10"></mao-pagination>
        <span className="demo-note">第 {page} 页</span>
      </Demo>

      <h2>精简模式</h2>
      <Demo
        code={`<mao-pagination total="86" page="3" page-size="20" simple></mao-pagination>`}
      >
        <mao-pagination total="86" page="3" page-size="20" simple></mao-pagination>
      </Demo>

      <h2>搭配每页条数</h2>
      <Demo
        code={`<mao-pagination total="240" page-size="20">
  <mao-select slot="sizes" options='[{"value":"20","label":"20 条/页"}]' value="20"></mao-select>
</mao-pagination>`}
      >
        <mao-pagination total="240" page-size="20">
          <mao-select slot="sizes" options='[{"value":"20","label":"20 条/页"}]' value="20"></mao-select>
        </mao-pagination>
      </Demo>

      <ApiProps tag="mao-pagination" />
    </>
  );
}
