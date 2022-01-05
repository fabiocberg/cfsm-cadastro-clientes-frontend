import { Avatar, Image } from "@chakra-ui/react";
import { Customer } from "../models/customer-model";

interface CustomerPictureProps {
  pictureBase64?: string;
  customer: Customer | null | undefined;
  onSelectPicture?: () => void;
}

export default function CustomerPicture(props: CustomerPictureProps) {
  return (
    <>
      {(props.pictureBase64 && props.pictureBase64.length > 0) ||
      props.customer?.pictureUrl ? (
        <Image
          src={
            props.pictureBase64 && props.pictureBase64.length > 0
              ? props.pictureBase64
              : props.customer?.pictureUrl || ""
          }
          boxSize={20}
          objectFit="contain"
          borderRadius="full"
          style={{ cursor: "pointer" }}
          onClick={props.onSelectPicture}
        />
      ) : (
        <Avatar
          bg="green"
          style={{ cursor: "pointer" }}
          onClick={props.onSelectPicture}
        />
      )}
    </>
  );
}
