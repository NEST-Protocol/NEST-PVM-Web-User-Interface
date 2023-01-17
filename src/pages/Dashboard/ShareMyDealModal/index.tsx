import {FC, useRef} from "react";
import BaseModal from "../../../components/BaseModal";
import Popup from "reactjs-popup";

const ShareMyDealModal: FC = () => {
  const modal = useRef<any>();

  return (
    <Popup
      modal
      ref={modal}
      trigger={
        <button>
          share
        </button>
      }
    >
      <BaseModal
        onClose={() => modal?.current?.close()}
      >
        <p>ShareMyDealModal</p>
      </BaseModal>
    </Popup>
  )
}

export default ShareMyDealModal