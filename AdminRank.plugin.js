/**
 * @name AdminRank
 * @author Geront
 * @authorId 701903800302305371
 * @description Помошник для заполнения отчетов
 * @source https://github.com/xXGerontXx/Geront/blob/main/AdminRank.plugin.js
 * @updateUrl https://raw.githubusercontent.com/xXGerontXx/Geront/main/AdminRank.plugin.js?token=GHSAT0AAAAAACHBOGWZP7KAJYTLID4EZFFSZHSFXWQ
 * @website https://github.com/xXGerontXx/Geront
 * @version 1.0
 */

"use strict";
const fs = require("fs");
const path = require('path');
const request = require("request");
const config = {
  version: {
    "base": "1.0",
  },
  urls: [
    "https://github.com/xXGerontXx/Geront/blob/main/configs.json",
    "https://github.com/xXGerontXx/Geront/blob/main/AdminRank.plugin.js",
    "https://github.com/xXGerontXx/GerontPRO/blob/main/selections.json",
  ],
}

var { useState, useMemo } = BdApi.React;
var {
    Button,
    ModalRoot,
    ModalHeader,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    FormTitle,
    FormText,
    Tooltip,
    Select,
    openModal
} = BdApi.Webpack.getModule((m) => m.ModalContent);

var ButtonWrapperClasses = BdApi.Webpack.getModule((m) => m.buttonWrapper && m.buttonContent);
var cl = (...names) => names.map((n) => `vbd-its-${n}`).join(" ");
var Servers = []
var Formats = [];

function ShowFormModal({ rootProps }) {
  const [server, setServer] = useState("");
  const [format, setFormat] = useState("");

  const [formatted, rendered] = useMemo(() => {
    const selectedFormat = Formats.find((f) => f.title === format);
    return [(selectedFormat) ? selectedFormat.value : "---", format];
  }, [format]);

  return BdApi.React.createElement(
    ModalRoot,
    { ...rootProps },
    BdApi.React.createElement(
      ModalHeader,
      { className: cl("modal-header") },
      BdApi.React.createElement(FormTitle, { tag: "h2" }, "Выбор формы"),
      BdApi.React.createElement(ModalCloseButton, { onClick: rootProps.onClose })
    ),
    BdApi.React.createElement(
      ModalContent,
      { className: cl("modal-content") }, BdApi.React.createElement(FormTitle, null, ""),
      BdApi.React.createElement(
        Select,
        {
          placeholder: "Выберите форму",
          options: Formats.map((m) => ({
            label: typeof m === "object" ? m.title : m,
            value: typeof m === "object" ? m.title : m,
            disabled: typeof m === "object" ? m.disabled : m
          })),
          isSelected: (v) => format === v,
          select: (v) => setFormat(v),
          serialize: (v) => v,
          renderOptionLabel: (o) =>
            BdApi.React.createElement("div", { className: cl("format-label") }, o.label),
          renderOptionValue: () => rendered
        }
      ),
      (format == "Выдача банов") ? BdApi.React.createElement(
        Select,
        {
          placeholder: "Выберите сервер",
          options: Servers.map((m) => ({
            label: typeof m === "object" ? m.name : m,
            value: typeof m === "object" ? m.name : m,
            disabled: typeof m === "object" ? m.disabled : m
          })),
          isSelected: (v) => server === v,
          select: (v) => setServer(v),
          serialize: (v) => v,
          renderOptionLabel: (o) =>
            BdApi.React.createElement("div", { className: cl("format-label") }, o.label),
          renderOptionValue: () => server,
        }
      ) : null,
    ),
    BdApi.React.createElement(
      ModalFooter,
      null,
      BdApi.React.createElement(
        Button,
        {
          disabled: (formatted == "---" || !formatted) ? true : ((format == "Выдача банов") ? ((!server) ? true : false) : false),
          onClick: () => {
            const ComponentDispatch = BdApi.Webpack.getModule((m) => m.emitter?._events?.INSERT_TEXT, {
              searchExports: true
            });
            ComponentDispatch.dispatchToLastSubscribed("INSERT_TEXT", {
              rawText: (format == "Выдача банов") ? formatted.replace("{{server}}", server).replace("{{timestamp}}", Math.floor(Date.now() / 1000)) : formatted,
              plainText: (format == "Выдача банов") ? formatted.replace("{{server}}", server).replace("{{timestamp}}", Math.floor(Date.now() / 1000)) : formatted
            });
            rootProps.onClose();
          }
        },
        "Вставить"
      )
    )
  );
}

function ChatBarComponent() {
  return BdApi.React.createElement(Tooltip, { text: "Открыть панель форм" }, ({ onMouseEnter, onMouseLeave }) => BdApi.React.createElement("div", { style: { marginTop: 10 } }, BdApi.React.createElement(
    Button,
    {
      "aria-haspopup": "dialog",
      "aria-label": "",
      size: "",
      look: Button.Looks.BLANK,
      onMouseEnter,
      onMouseLeave,
      innerClassName: ButtonWrapperClasses.button,
      onClick: () => {
        openModal((props) => BdApi.React.createElement(ShowFormModal, { rootProps: props }));
      },
      className: cl("button")
    },
    BdApi.React.createElement("div", { className: ButtonWrapperClasses.buttonWrapper }, BdApi.React.createElement("svg", { "aria-hidden": "true", role: "img", width: "24", height: "24", viewBox: "0 0 24 24" }, BdApi.React.createElement("g", { fill: "none", "fill-rule": "evenodd" }, BdApi.React.createElement(
      "path",
      {
        fill: "orange",
        d: "M22 12L12.101 2.10101L10.686 3.51401L12.101 4.92901L7.15096 9.87801V9.88001L5.73596 8.46501L4.32196 9.88001L8.56496 14.122L2.90796 19.778L4.32196 21.192L9.97896 15.536L14.222 19.778L15.636 18.364L14.222 16.95L19.171 12H19.172L20.586 13.414L22 12Z"
      }
    ), BdApi.React.createElement("rect", { width: "24", height: "24" }))))
  )));
}

function findInReactTree(root, filter) {
  return BdApi.Utils.findInTree(root, filter, {
    walkable: ["children", "props"]
  });
}

var styles_default = `.vbd-its-modal-content input {
    background-color: var(--input-background);
    color: var(--text-normal);
    width: 95%;
    padding: 8px 8px 8px 12px;
    margin: 1em 0;
    outline: none;
    border: 1px solid var(--input-background);
    border-radius: 4px;
    font-weight: 500;
    font-style: inherit;
    font-size: 100%;
}

.vbd-its-format-label,
.vbd-its-format-label span {
    background-color: transparent;
}

.vbd-its-modal-content [class|="select"] {
    margin-bottom: 1em;
}

.vbd-its-modal-content [class|="select"] span {
    background-color: var(--input-background);
}

.vbd-its-modal-header {
    justify-content: space-between;
    align-content: center;
}

.vbd-its-modal-header h1 {
    margin: 0;
}

.vbd-its-modal-header button {
    padding: 0;
}

.vbd-its-preview-text {
    margin-bottom: 1em;
}

.vbd-its-button {
    padding: 0 6px;
}

.vbd-its-button svg {
    transform: scale(1.1) translateY(1px);
}
`;

function load() {
  request.get(
    config.urls[0],
    (error, response, body) => {
      if (error) {
        BdApi.showToast(error, { type: "error" });
        return;
      }
      
      if (response.statusCode == 200) {
        const versionData = JSON.parse(body.toString());
        
        const old_version = config.version['base'];
        const new_version = versionData.versions['select-forms'];
        const changelogs = versionData.changelogs['select-forms'];
        if (old_version < new_version) {
          BdApi.showConfirmationModal(
            "AdminRank | Новое обновление!",
            `Ваша версия: \`${old_version}\` | Новая версия: \`${new_version}\`\n\n \n\n\`СПИСОК ИЗМЕНЕНИЙ:\`\n\n${changelogs}`,
            {
              confirmText: "Установить",
              cancelText: "Отменить",
              onConfirm: () => {
                BdApi.showToast("Начинаем загрузку..", {type: "info"});

                request.get(
                  config.urls[1],
                  (error, response, body) => {
                    if (error) {
                      BdApi.showToast(`Ошибка при загрузка: ${error}`, { type: "error" });
                      return;
                    }

                    if (response.statusCode == 200) {
                      fs.writeFileSync(
                        path.join(BdApi.Plugins.folder, "AdminRank.plugin.js"),
                        body
                      );
                      
                      BdApi.showToast(`Обновление загружено!`, { type: "success" });
                    } else BdApi.showToast(`Ошибка при установке обновления.`, { type: "warning" });
                  }
                );
              }
            }
          );
        }
      }
    }
  );

  
  setTimeout(() => {
    request.get(
      config.urls[2],
      (error, response, body) => {
        if (error) {
          BdApi.showToast(error, { type: "error" });
          return;
        }
        
        if (response.statusCode == 200) {
          const result = JSON.parse(body.toString());

          
          const base = result['standart'].data;
          const serv = result['servers'].data;

          // console.log(JSON.stringify(serv));

          for (let i = 0; i < base.length; i++) {
            Formats.push({
              "title": base[i]['title'],
              "value": base[i]['value'],
              "disabled": base[i]['disabled'],
            });
          }
          for (let i = 0; i < serv.length; i++) {
            Servers.push({
              "name": serv[i]['name'],
              "disabled": serv[i]['disabled'],
            });
          }

          
          // CUSTOM FORM`S
          if (fs.existsSync(BdApi.Plugins.folder+"\\"+"AdminRank.config.json")) {
            fs.readFile(BdApi.Plugins.folder+"\\"+"AdminRank.config.json", 'utf8', function(err, data) {
              if (err) {
                setTimeout(() => {
                  BdApi.showToast("Кастомные форма не загружены!\n"+err, { type: "error" })
                }, 1500);
                console.log(err);
  
                return;
              }
    
              if (data == "{}" || !data) {
                setTimeout(() => {
                  BdApi.showToast("Кастомные форма не настроены!", { type: "error" })
                }, 1500);
                
                return;
              } else {
                const form = JSON.parse(data)['forms'];
  
                for (let i = 0; i < form.length; i++) {
                  Formats.push({
                    "title": form[i]['title'],
                    "value": form[i]['value'],
                    "disabled": form[i]['disabled'],
                  });
                }
              }
            });
          } else {
            const standartCustomForm = {
              "forms": [
                {
                    "title": "Пример 1",
                    "value": "Примерочная форма #1",
                    "disabled": false
                },
                {
                    "title": "Пример 2",
                    "value": "Примерочная форма #2",
                    "disabled": false
                }
              ]
            }
            
            // LOAD CUSTOM FORM`S
            fs.writeFile(BdApi.Plugins.folder+"\\"+"AdminRank.config.json", JSON.stringify(standartCustomForm, null, 2), (err) => {
              if (err) {
                setTimeout(() => {
                  BdApi.showToast("Ошибка при создании файла", { type: "error" })
                }, 1500);
                
                return;
              }

              
              BdApi.showToast("Файл конфигураций не найден! Начинаем создавать его..", { type: "warning" })
            });

            setTimeout(() => {
              fs.readFile(BdApi.Plugins.folder+"\\"+"AdminRank.config.json", 'utf8', function(err, data) {
                if (err) {
                  setTimeout(() => {
                    BdApi.showToast("Кастомные форма не загружены!\n"+err, { type: "error" })
                  }, 1500);
                  console.log(err);
    
                  return;
                }
      
                if (data == "{}" || !data) {
                  setTimeout(() => {
                    BdApi.showToast("Кастомные форма не настроены!", { type: "error" })
                  }, 1500);
                  
                  return;
                } else {
                  const form = JSON.parse(data)['forms'];
    
                  for (let i = 0; i < form.length; i++) {
                    Formats.push({
                      "title": form[i]['title'],
                      "value": form[i]['value'],
                      "disabled": form[i]['disabled'],
                    });
                  }
                }
              });
            }, 150);
          }

          
          setTimeout(() => {
            BdApi.showToast("Все формы загружены!", { type: "info" });
          }, 3000);
        } else {
          BdApi.showToast(`Формы не загружены!\nСообщите об этом разработчику: @geront`, { type: "error" });
        }
      }
    );
  }, 100);
}
function getSettingsPanel() {
    const SettingsPanel = document.createElement("div");
    SettingsPanel.id = "my-settings";


    const TextSetting = document.createElement("div");
    TextSetting.classList.add("setting");

    const TextLabel = document.createElement("p")
    TextLabel.innerHTML = "<center style=\"color: #f8884d;\">Что-то будет..</center>";

    TextSetting.append(TextLabel);


    SettingsPanel.append(TextSetting);
    return SettingsPanel;
}

var Chat = BdApi.Webpack.getModule((m) => m.Z?.type?.render?.toString().includes("chat input type must be set"));
function start() {
  BdApi.DOM.addStyle("vbd-st", styles_default);
  BdApi.Patcher.after("vbd-st", Chat.Z.type, "render", (_this, _args, res) => {
    const chatBar = findInReactTree(
      res,
      (n) => Array.isArray(n?.children) && n.children.some((c) => c?.props?.className?.startsWith("attachButton"))
    )?.children;
    if (!chatBar) {
      console.error("AdminRank: Couldn't find ChatBar component in React tree");
      return;
    }
    const buttons = findInReactTree(chatBar, (n) => n?.props?.showCharacterCount);
    if (buttons?.props.disabled)
      return;
    chatBar.splice(-1, 0, BdApi.React.createElement(ChatBarComponent, null));
  });
}
function stop() {
  BdApi.DOM.removeStyle("vbd-st");
  BdApi.Patcher.unpatchAll("vbd-st");
}

module.exports = _ => ({
  load,
  start,
  stop,
  getSettingsPanel
});
