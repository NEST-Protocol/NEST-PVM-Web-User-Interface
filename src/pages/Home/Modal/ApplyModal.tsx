import {Box, Drawer, Modal, Stack} from "@mui/material";
import useWindowWidth from "../../../hooks/useWindowWidth";
import BaseDrawer from "../../Share/Modal/BaseDrawer";
import {FC, useState} from "react";
import BaseModal from "../../Share/Modal/BaseModal";
import {styled} from "@mui/material/styles";
import MainButton from "../../../components/MainButton/MainButton";
import {DownIcon, Success} from "../../../components/icons";
import DashboardBaseModal from "../../Dashboard/Components/DashboardBaseModal";
import NESTLine from "../../../components/NESTLine";
import NormalInput from "../../../components/NormalInput/NormalInput";
import {t, Trans} from "@lingui/macro";

const Title1 = styled("div")(({theme}) => ({
  fontWeight: "400",
  fontSize: "12px",
  lineHeight: "16px",
  color: theme.normal.text2,
}));

const Select1 = styled("select")(({theme}) => ({
  width: "100%",
  fontWeight: "700",
  fontSize: "16px",
  lineHeight: "22px",
  background: theme.normal.bg1,
  color: theme.normal.text0,
  height: '48px',
  padding: '0 12px',
  border: "1px solid",
  borderColor: theme.normal.border,
  borderRadius: "8px",
  "&:hover": {
    border: `1px solid ${theme.normal.primary}`,
  },
  "-webkit-appearance": "none",
  "-moz-appearance": "none",
  appearance: "none",
}));

const Title2 = styled("div")(({theme}) => ({
  fontWeight: "700",
  fontSize: "16px",
  lineHeight: "22px",
  textAlign: 'center',
  color: theme.normal.text0,
}));

const IconDiv = styled('div')(({theme}) => ({
  "& svg": {
    width: "44px",
    height: "44px",
    display: "block",
    "& path": {
      fill: theme.normal.success
    },
  },
}));

interface ApplyModalProps {
  open: boolean;
  onClose: () => void;
}

interface ApplyModalBaseProps {
  setShowSuccess: (success: boolean) => void;
  onClose: () => void;
}

const ApplyModalBase: FC<ApplyModalBaseProps> = ({...props}) => {
  const [loading, setLoading] = useState(false)
  const [info, setInfo] = useState({
    country: '',
    language: '',
    platform: 'Youtube',
    channel_link: '',
    subscribers: '',
    collaborated_cexs: '',
    contact_info: '',
  })

  const postInfo = () => {
    setLoading(true)
    fetch('https://api.nestfi.net/api/users/kol/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(info)
    }).then(() => {
      setLoading(false)
      props.setShowSuccess(true)
    })
  }

  return (
    <Stack spacing={'24px'}>
      <Stack spacing={'8px'}>
        <Title1>{t`Platform (Youtube, Telegram, Twitter, Instagram, Facebook, Tiktok, Others)`}</Title1>
        <Box position={'relative'}>
          <Stack position={'absolute'} sx={(theme) => ({
            right: '12px',
            height: '48px',
            justifyContent: 'center',
            '& svg': {
              height: '12px',
              width: '12px',
              '& path': {
                fill: theme.normal.text2
              },
            },
          })}>
            <DownIcon/>
          </Stack>
          <Select1 onChange={(e) => {
            setInfo({...info, platform: e.target.value})
          }}>
            <option value="Youtube">
              <Trans>Youtube</Trans>
            </option>
            <option value="Telegram">Telegram</option>
            <option value="Twitter">Twitter</option>
            <option value="Instagram">Instagram</option>
            <option value="Facebook">Facebook</option>
            <option value="Tiktok">Tiktok</option>
            <option value="Others">Others</option>
          </Select1>
        </Box>
      </Stack>
      <Stack spacing={'8px'}>
        <Title1>{t`Channel link`}</Title1>
        <NormalInput placeHolder={t`Enter Channel link`} rightTitle={''} value={info.channel_link} changeValue={(value) => setInfo({...info, channel_link: value})} />
      </Stack>
      <Stack spacing={'8px'}>
        <Title1>{t`Contact info (Telegram handle)`}</Title1>
        <NormalInput placeHolder={t`Enter your Contact info`} rightTitle={''} value={info.contact_info} changeValue={(value) => setInfo({...info, contact_info: value})} />
      </Stack>
      <NESTLine/>
      <MainButton title={t`Confirm`} disable={!info.platform || !info.channel_link || !info.contact_info}
                  style={{width: '100%', height: "48px"}}
                  onClick={postInfo} isLoading={loading}/>
    </Stack>
  )
}

const ApplyModal: FC<ApplyModalProps> = ({...props}) => {
  const {isMobile} = useWindowWidth();
  const [showSuccess, setShowSuccess] = useState(false)

  if (showSuccess) {
    return (
      <Modal
        open={props.open}
        onClose={() => {
          setShowSuccess(false)
          props.onClose()
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box>
          <DashboardBaseModal>
            <Stack width={'100%'} alignItems={"center"} spacing={'18px'} px={'20px'} pt={'50px'} pb={'20px'}
                   borderRadius={'12px'}>
              <IconDiv>
                <Success/>
              </IconDiv>
              <Title2 style={{paddingBottom: '22px'}}>
                {t`Submit successfully`}
              </Title2>
              <MainButton title={t`I understand`} style={{width: '100%', height: "48px"}} onClick={() => {
                setShowSuccess(false)
                props.onClose()
              }}/>
            </Stack>
          </DashboardBaseModal>
        </Box>
      </Modal>
    )
  }

  if (isMobile) {
    return (
      <Drawer
        anchor={"bottom"}
        open={props.open}
        onClose={() => {
          setShowSuccess(false)
          props.onClose()
        }}
        sx={{
          "& .MuiPaper-root": {background: "none", backgroundImage: "none"},
        }}
      >
        <Box>
          <BaseDrawer title={t`Become a Trading KOL`} onClose={props.onClose}>
            <ApplyModalBase onClose={props.onClose} setShowSuccess={setShowSuccess}/>
          </BaseDrawer>
        </Box>
      </Drawer>
    )
  }

  return (
    <Modal
      open={props.open}
      onClose={() => props.onClose()}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box>
        <BaseModal title={t`Become a Trading KOL`} onClose={props.onClose}>
          <ApplyModalBase onClose={props.onClose} setShowSuccess={setShowSuccess}/>
        </BaseModal>
      </Box>
    </Modal>
  )
}

export default ApplyModal