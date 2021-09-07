import { embedDashboard } from "amazon-quicksight-embedding-sdk";
let dashBoard = null;

function getEmbeddedUrl(setLoad) {
  fetch(process.env.GET_EMBEDDED_QUICKSIGHT_DASHBOARD_URL)
    .then((response) => response.json())
    .then((data) => {
      const json = data.message;
      loadDashboard(json.EmbedUrl, setLoad);
    });
}

function loadDashboard(url, setLoad) {
  const options = {
    url,
    container: "#quick-sight-dashboard-container",
    parameters: {},
    scrolling: "no",
    height: "1000px",
    width: "1000px",
    locale: "en-US",
    footerPaddingEnabled: true,
    loadCallback: (data) => {
      setLoad(false);
      console.log("=== dashboard loaded completely", data);
    },
    getSheetsCallback: (sheets) => {
      console.log(sheets);
    },
    selectedSheetChangeCallback: (sheet) => {
      console.log(sheet);
    },
    getActiveParametersCallback: (params) => console.log(params),
    parametersChangeCallback: (param) => console.log(param)
  };
  dashBoard = embedDashboard(options);
  dashBoard.on("error", (payload) => {
    console.log(payload);
    setLoad(true);
    if (payload && payload.errorCode === "Unauthorized") {
      getEmbeddedUrl(setLoad);
    }
  });
}

export { getEmbeddedUrl };
