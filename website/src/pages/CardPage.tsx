import { useState } from "react";
import { ApiProps } from "../components/ApiProps.tsx";
import { Demo } from "../components/Demo.tsx";

export function CardPage() {
  const [clicks, setClicks] = useState(0);

  return (
    <>
      <h1>卡片</h1>
      <pre className="demo-code">import "maotaui";</pre>

      <h2>基础用法</h2>
      <Demo
        code={`<mao-card bordered>
  <div class="mt-card-body">
    <div class="mt-card-header">卡片标题</div>
    一个带描边与内边距的容器。
  </div>
</mao-card>`}
      >
        <mao-card bordered>
          <div className="mt-card-body">
            <div className="mt-card-header">卡片标题</div>
            一个带描边与内边距的容器。
          </div>
        </mao-card>
      </Demo>

      <h2>内边距</h2>
      <Demo
        code={`<mao-card bordered padding="sm"><div class="mt-card-body">12px（紧凑）</div></mao-card>
<mao-card bordered padding="md"><div class="mt-card-body">20px</div></mao-card>
<mao-card bordered padding="lg"><div class="mt-card-body">24px（默认）</div></mao-card>`}
      >
        <div className="demo-grid">
          <mao-card bordered padding="sm">
            <div className="mt-card-body">12px（紧凑）</div>
          </mao-card>
          <mao-card bordered padding="md">
            <div className="mt-card-body">20px</div>
          </mao-card>
          <mao-card bordered padding="lg">
            <div className="mt-card-body">24px（默认）</div>
          </mao-card>
        </div>
      </Demo>

      <h2>悬浮与点击</h2>
      <Demo
        code={`<mao-card bordered hoverable><div class="mt-card-body">悬停上浮</div></mao-card>

<mao-card bordered clickable onClick={() => setClicks(clicks + 1)}>
  <div class="mt-card-body">可点击，已点击 {clicks} 次</div>
</mao-card>`}
      >
        <div className="demo-grid">
          <mao-card bordered hoverable>
            <div className="mt-card-body">悬停上浮</div>
          </mao-card>
          <mao-card bordered clickable onClick={() => setClicks((now) => now + 1)}>
            <div className="mt-card-body">可点击，已点击 {clicks} 次</div>
          </mao-card>
        </div>
      </Demo>

      <h2>链接卡片</h2>
      <Demo
        code={`<mao-card bordered hoverable href="#/button">
  <div class="mt-card-body">点击整张卡片跳转到按钮文档。</div>
</mao-card>`}
      >
        <div className="demo-grid">
          <mao-card bordered hoverable href="#/button">
            <div className="mt-card-body">点击整张卡片跳转到按钮文档。</div>
          </mao-card>
        </div>
      </Demo>

      <h2>结构化内容</h2>
      <Demo
        code={`<mao-card bordered>
  <div class="mt-card-cover demo-cover"></div>
  <div class="mt-card-body">
    <div class="mt-card-header">卡片标题</div>
    cover、header、footer 与默认插槽可自由组合。
    <div class="mt-card-footer">
      <mao-button size="sm" variant="bordered">取消</mao-button>
      <mao-button size="sm" color="primary">确定</mao-button>
    </div>
  </div>
</mao-card>`}
      >
        <div className="demo-grid">
          <mao-card bordered>
            <div className="mt-card-cover demo-cover" />
            <div className="mt-card-body">
              <div className="mt-card-header">卡片标题</div>
              cover、header、footer 与默认插槽可自由组合。
              <div className="mt-card-footer">
                <mao-button size="sm" variant="bordered">
                  取消
                </mao-button>
                <mao-button size="sm" color="primary">
                  确定
                </mao-button>
              </div>
            </div>
          </mao-card>
        </div>
      </Demo>

      <ApiProps tag="mao-card" />
    </>
  );
}
