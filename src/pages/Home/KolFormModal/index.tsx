import {FC, MouseEventHandler, useState} from "react";
import './styles/index'
import BaseModal from "../../../components/BaseModal";
import MainButton from "../../../components/MainButton";
import {Divider, Stack} from "@mui/material";
import useThemes, {ThemeType} from "../../../libs/hooks/useThemes";

type Props = {
  onClose?: MouseEventHandler<HTMLButtonElement>;
};

const KolFormModal: FC<Props> = ({...props}) => {
  const {theme} = useThemes()
  const [info, setInfo] = useState({
    country: '',
    language: '',
    platform: 'Youtube',
    channel_link: '',
    subscribers: '',
    collaborated_cexs: '',
    contact_info: '',
  })
  const [loading, setLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const postInfo = async () => {
    setLoading(true)
    const res = await fetch('https://api.nestfi.net/api/users/kol/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(info)
    })
    console.log(res)
    setLoading(false)
    setShowSuccess(true)
  }

  if (showSuccess) {
    return (
      <BaseModal classNames={`${theme === ThemeType.dark ? 'dark' : ''}`} onClose={() => {
        setShowSuccess(false)
        props.onClose && props.onClose({} as any)
      }}>
        <Stack spacing={'20px'} padding={'0 20px 20px 20px'} alignItems={"center"} minWidth={'320px'}>
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M30.7489 30.7278C23.7205 37.7562 12.3607 37.7562 5.33232 30.7278C-1.69605 23.6994 -1.69605 12.2579 5.2506 5.22952C12.279 -1.71713 23.7205 -1.71713 30.7489 5.22952C37.6955 12.2579 37.6955 23.6994 30.7489 30.7278ZM29.1144 10.9503C28.624 10.4599 27.8885 10.4599 27.4799 10.9503L15.2211 23.2091L9.50031 17.4883C9.00996 16.998 8.27444 16.998 7.86581 17.4883C7.37546 17.9787 7.37546 18.7142 7.86581 19.1228L14.0769 25.3339C14.0769 25.3339 14.5673 25.906 15.3028 25.906C15.8749 25.906 16.3652 25.3339 16.3652 25.3339L29.1144 12.5848C29.6047 12.1762 29.6047 11.4406 29.1144 10.9503Z"
              fill="url(#paint0_linear_929_78043)"/>
            <defs>
              <linearGradient id="paint0_linear_929_78043" x1="0.0507813" y1="18.0093" x2="35.9589" y2="18.0093"
                              gradientUnits="userSpaceOnUse">
                <stop stopColor="#80D5F8"/>
                <stop offset="1" stopColor="#54BEF3"/>
              </linearGradient>
            </defs>
          </svg>
          <div className={'modal-text'}>
            Submit successfully
          </div>
        </Stack>
      </BaseModal>
    )
  }

  return (
    <BaseModal titleName={'Become a Trading KOL'} classNames={`${theme === ThemeType.dark ? 'dark' : ''}`}
               onClose={props.onClose}>
      <Stack position={'relative'}>
        <Stack spacing={'20px'} overflow={'scroll'} width={['100%', '570px']} pt={'20px'} pb={'60px'}>
          <Stack spacing={'8px'} width={'100%'}>
            <div className={'label'}>
              Platform (Youtube, Telegram, Twitter, Instagram, Facebook, Tiktok, Others)
            </div>
            <select style={{ cursor: 'pointer', appearance: 'none'}} className={'kol-input'} onChange={(e) => {
              setInfo({...info, platform: e.target.value})
            }}>
              <option value="Youtube">Youtube</option>
              <option value="Telegram">Telegram</option>
              <option value="Twitter">Twitter</option>
              <option value="Instagram">Instagram</option>
              <option value="Facebook">Facebook</option>
              <option value="Tiktok">Tiktok</option>
              <option value="Others">Others</option>
            </select>

            {/*<input className={'kol-input'} placeholder={'Enter your Platform'} onChange={(e) => {*/}
            {/*  setInfo({...info, platform: e.target.value})*/}
            {/*}}/>*/}
          </Stack>
          <Stack spacing={'8px'} width={'100%'}>
            <div className={'label'}>
              Channel link
            </div>
            <input className={'kol-input'} placeholder={'Enter your Channel link'} onChange={(e) => {
              setInfo({...info, channel_link: e.target.value})
            }}/>
          </Stack>
          <Stack spacing={'8px'} width={'100%'}>
            <div className={'label'}>
              Contact info (Telegram handle)
            </div>
            <input className={'kol-input'} placeholder={'Enter your Contact info'} onChange={(e) => {
              setInfo({...info, contact_info: e.target.value})
            }}/>
          </Stack>
          <Divider/>
          <Stack position={'absolute'} bottom={0} width={'100%'}>
            <MainButton
              className={'btn'}
              disable={!info.platform || !info.channel_link || !info.contact_info}
              onClick={async () => {
                await postInfo()
              }}
              loading={loading}
            >
              Confirm
            </MainButton>
          </Stack>
        </Stack>
      </Stack>

    </BaseModal>
  )
};

export default KolFormModal