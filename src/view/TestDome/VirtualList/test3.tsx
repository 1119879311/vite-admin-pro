import VList from "./componentPro";

let data: any[] = [];
for (let id = 0; id < 1000; id++) {
  data.push({
    id,
  });
}

export default function App() {
  return (
    <div className="App">
      <VList list={data}></VList>
    </div>
  );
}
