import {Box, Modal, Stack} from "@mui/material";
import {FC} from "react";
import BaseModal from "../Components/DashboardBaseModal";
import {Close} from "../../../components/icons";
import {styled} from "@mui/material/styles";

interface ShareMyDealModalProps {
  open: boolean;
  onClose: () => void;
}

const TopStack = styled(Stack)(({theme}) => {
  return {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: '20px',
    marginBottom: 20,
    "& button": {
      width: 20,
      height: 20,
      "&:hover": {
        cursor: "pointer",
      },
      "& svg": {
        width: 20,
        height: 20,
        "& path": {
          fill: "rgba(249, 249, 249, 0.6)",
        },
      },
    },
  };
});

const UnTxUserModal: FC<ShareMyDealModalProps> = ({...props}) => {

  return (
    <Modal
      open={props.open}
      onClose={() => {
        props.onClose()
      }}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box>
        <BaseModal>
          <Stack p={'20px'} width={'100%'} position={'relative'}>
            <TopStack
              sx={{
                "& button": {
                  "& svg": {
                    "& path": {
                      fill: "rgba(249, 249, 249, 0.6)",
                    },
                  },
                },
              }}
            >
              <button onClick={() => {
                props.onClose()
              }}>
                <Close/>
              </button>
            </TopStack>
            <Stack alignItems={"center"}>
              <Box sx={(theme) => ({
                color: theme.normal.text0,
              })}>从未交易过名单</Box>
            </Stack>
            <Stack spacing={'12px'} pt={'25px'}>
              <Stack width={'100%'} spacing={'4px'} sx={(theme) => ({
                padding: '20px 16px',
                color: theme.normal.text0,
                border: `1px solid ${theme.normal.border}`,
                borderRadius: '12px',
                fontSize: '14px',
                lineHeight: '20px',
                fontWeight: 700,
                "span": {
                  color: theme.normal.text0,
                  fontWeight: 400,
                  fontSize: '12px',
                  lineHeight: '16px',
                }
              })}>
                <div>@dddd</div>
                <span>0x0000000</span>
              </Stack>
            </Stack>
          </Stack>
        </BaseModal>
      </Box>
    </Modal>
  )
}

export default UnTxUserModal