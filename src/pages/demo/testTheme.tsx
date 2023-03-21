import { FC, useState } from "react";
import { styled } from "@mui/material/styles";
import ButtonUnstyled from "@mui/base/ButtonUnstyled";
import Stack from "@mui/material/Stack";
import useNEST from "../../hooks/useNEST";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Alert from "@mui/material/Alert";
import NavMenu from "../Share/Head/NavMenu";
import useTheme from "../../hooks/useTheme";
import { SnackBarType } from "../../components/SnackBar/NormalSnackBar";
import { BigNumber } from "ethers";
import useTokenApprove from "../../contracts/useTokenContract";
import useTransactionSnackBar from "../../hooks/useNESTSnackBar";

const ThemeButton2 = styled(ButtonUnstyled)(({ theme }) => ({
  backgroundColor: theme.normal.primary,
  width: 200,
}));
const NESTTabs = styled(Tabs)(({ theme }) => ({
  "& .MuiTabs-scroller .MuiTabs-flexContainer .Mui-selected": {
    color: "#56d7f4",
  },
  "& .MuiTabs-scroller .MuiTabs-indicator": {
    backgroundColor: "#56d7f4",
  },
}));

const TestTheme: FC = () => {
  const { account, connectData, chainsData, disconnect } = useNEST();
  const { transactionSnackBar, messageSnackBar } = useTransactionSnackBar();
  const { changeTheme } = useTheme();
  const [value, setValue] = useState(0);
  const [a, setA] = useState<`0x${string}`>(
    "0x821edD79cc386E56FeC9DA5793b87a3A52373cdE"
  );
  const { transaction: tokenApprove } = useTokenApprove(
    a,
    account.address,
    BigNumber.from("1000")
  );

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  return (
    <Stack spacing={2}>
      <NESTTabs value={value} onChange={handleChange} centered>
        <Tab label={<p>55555</p>} />
        <Tab label="Item Two" />
        <Tab label="Item Three" />
      </NESTTabs>
      <ThemeButton2 onClick={changeTheme}>切换</ThemeButton2>
      <Stack direction="column" spacing={0}>
        <div>
          {connectData.connectors.map((x) => (
            <button
              disabled={false}
              key={x.name}
              onClick={() => connectData.connect({ connector: x })}
            >
              {x.id === "injected" ? x.id : x.name}
              {!x.ready && " (unsupported)"}
              {connectData.isLoading &&
                x.id === connectData.pendingConnector?.id &&
                "…"}
            </button>
          ))}
        </div>

        <div>{connectData.error && connectData.error.message}</div>
      </Stack>
      <Stack direction="column" spacing={0}>
        <p>{account.address?.showAddress()}</p>
        <button onClick={() => disconnect.disconnect()}>断开</button>
        <button onClick={() => chainsData.switchNetwork?.(97)}>
          切换测试网
        </button>
      </Stack>
      <Stack direction="column" spacing={0}>
        <Alert variant="filled" severity="error">
          This is an error alert — check it out!
        </Alert>
      </Stack>
      <Stack direction="column" spacing={0}>
        <NavMenu />
        <button
          onClick={() =>
            transactionSnackBar("Approve", "NB", SnackBarType.fail, "6666")
          }
        >
          Show snackbar
        </button>

        <button
          onClick={() => {
            if (account.address) {
              tokenApprove.write?.();
            }
          }}
        >
          发送交易测试
        </button>
        <button
          onClick={() => setA("0x295d0351CaC5c1Cc8aF551D91376AF7fEBb80E0A")}
        >
          切换token
        </button>
        <button onClick={() => messageSnackBar('copy')}>
          测试message
        </button>
      </Stack>
    </Stack>
  );
};

export default TestTheme;
