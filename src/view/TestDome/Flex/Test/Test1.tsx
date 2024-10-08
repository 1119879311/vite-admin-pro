import Flex from "@/components/Flex";
import ScrollBox from "@/components/ScrollBox";
export const LayoutTest1 = () => {
  return (
    <div style={{ width: "100%", height: "500px" }}>
      <Flex
        // justifyContent="space-between"
        height={"300px"}
        border={"1px solid #ddd"}
        padding={"12px 0 12px 12px"}
        flexDirection="column"
        background={"#ddd"}
      >
        <Flex flex={"0 0 auto"}>搜索</Flex>

        <ScrollBox
          padding={"16px"}
          border={"1px solid #ddd"}
          innerProps={{ background: "#fff", padding: "12px" }}
        >
          <Flex height={"1200px"} background={"red"}>
            1212
          </Flex>
        </ScrollBox>
      </Flex>

      {/* <Flex justifyContent="space-between">
        <Flex flex={"100%"} background={"#ddd"} padding={"16px"}>
          12
        </Flex>
        <Flex flex={"auto"}>1212</Flex>
      </Flex> */}
    </div>
  );
};
