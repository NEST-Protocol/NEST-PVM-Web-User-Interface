import Stack from "@mui/material/Stack";
import { FC, useState } from "react";
import Agree from "../../../components/Agree/Agree";
import MainButton from "../../../components/MainButton/MainButton";
import BaseModal from "../../Share/Modal/BaseModal";

interface BaseProtocolModalProps {
  onClose: () => void;
  children: React.ReactNode;
  buttonClick: (agree: boolean) => void;
  title: string;
}

const BaseProtocolModal: FC<BaseProtocolModalProps> = ({
  children,
  ...props
}) => {
  const [agree, setAgree] = useState(false);
  return (
    <BaseModal title={props.title} onClose={props.onClose}>
      <Stack
        sx={(theme) => ({
          maxHeight: "300px",
          overflow: "auto",
          fontSize: 12,
          fontWeight: 400,
          color: theme.normal.text2,
        })}
      >
        {children}
      </Stack>
      <Stack
        direction={"row"}
        spacing={"8px"}
        justifyContent={"space-between"}
        alignItems={"flex-start"}
        sx={(theme) => ({
          marginTop: "10px",
          fontSize: 12,
          fontWeight: 400,
          color: theme.normal.text0,
        })}
      >
        <Agree
          value={agree}
          changeValue={(value) => setAgree(value)}
          style={{ marginTop: "2px" }}
        />
        <p>
          I have read carefully and fully understand the above risks, and I am
          willing to bear the losses caused by the risks.
        </p>
      </Stack>
      <MainButton
        title={"Sure"}
        onClick={() => {
          props.buttonClick(agree);
          props.onClose();
        }}
        style={{ height: "40px", fontSize: "14px", marginTop: "16px" }}
      />
    </BaseModal>
  );
};

export default BaseProtocolModal;
