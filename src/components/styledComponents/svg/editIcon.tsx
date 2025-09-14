import { FC } from 'react';


interface IconProps {
  className?: string; 
}

const EditIcon: FC<IconProps> = ({
  className = '', // Default to an empty string
  ...props
}) => {
  return (
<svg className={className} {...props} viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0 14.2505V18H3.54119L13.9853 6.9415L10.4441 3.19201L0 14.2505ZM16.7238 4.0419C16.8114 3.94939 16.8808 3.83952 16.9282 3.71856C16.9756 3.59761 17 3.46794 17 3.33699C17 3.20604 16.9756 3.07638 16.9282 2.95542C16.8808 2.83446 16.8114 2.72459 16.7238 2.63209L14.5141 0.292404C14.4268 0.199713 14.323 0.126176 14.2088 0.0760011C14.0945 0.0258265 13.9721 0 13.8484 0C13.7247 0 13.6023 0.0258265 13.488 0.0760011C13.3738 0.126176 13.27 0.199713 13.1827 0.292404L11.4546 2.12216L14.9957 5.87165L16.7238 4.0419Z" fill="black"/>
</svg>


  );
};

export default EditIcon;