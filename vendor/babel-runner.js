(function () {
  function showError(error) {
    console.error('Babel runner failed:', error);
    var box = document.createElement('pre');
    box.style.cssText = 'position:fixed;inset:12px;z-index:999999;overflow:auto;padding:16px;background:#fff;color:#b00020;border:3px solid #b00020;font:13px/1.5 monospace;white-space:pre-wrap;';
    box.textContent = '页面脚本执行失败：\n' + (error && (error.stack || error.message || String(error)));
    document.body.appendChild(box);
  }

  function runBabelScripts() {
    if (!window.Babel) return showError(new Error('Babel 没有加载'));
    var scripts = Array.prototype.slice.call(document.querySelectorAll('script[type="text/babel"]'));
    scripts.forEach(function (script) {
      if (script.dataset.babelRan === 'true') return;
      script.dataset.babelRan = 'true';
      try {
        var code = script.textContent || '';
        var transformed = window.Babel.transform(code, { presets: [[window.Babel.availablePresets.react, { runtime: 'classic' }]] }).code;
        (0, eval)(transformed);
      } catch (error) {
        window.__babelRunnerError = error;
        showError(error);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runBabelScripts);
  } else {
    runBabelScripts();
  }
})();
