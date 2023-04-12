import {Text} from "@mantine/core";
import React from "react";

interface MeddyTextComponentProps {
  size?: number
}
const MeddyTextComponent = (props: MeddyTextComponentProps) => {
  return (
      <Text
          variant="gradient"
          gradient={{from: 'indigo', to: 'cyan', deg: 45}}
          sx={{fontFamily: 'Greycliff CF, sans-serif'}}
          ta="center"
          size={props.size}
          fw={700}
      >Meddy</Text>
  )
}

export default MeddyTextComponent;