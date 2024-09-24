import { getApp } from "./app";
import { getConfig } from "./utils/config";

const { PORT } = getConfig();
const app = getApp();

app.listen(PORT, () => {
  console.log(`Server listening on: http://localhost:${PORT}`);
});
