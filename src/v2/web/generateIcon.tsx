import React, { FC, SVGProps, PropsWithChildren, HTMLAttributes } from 'react';

type IIconComponent = FC<SVGProps<SVGSVGElement>>;
export interface IIconBaseProps
  extends PropsWithChildren<HTMLAttributes<HTMLSpanElement>> {}
export type IIconComponentType = FC<IIconBaseProps>;

function IconBase(props: IIconBaseProps) {
  const { children, style, ...rest } = props;
  return (
    <span
      style={{ display: 'inline-flex', alignItems: 'center', ...style }}
      {...rest}
    >
      {children}
    </span>
  );
}

interface IGenerateIconOptions {
  // Multi-color icons keep their authored fills instead of inheriting the text color.
  multiColor?: boolean;
}

export default function generateIcon(
  IconComponent: IIconComponent,
  { multiColor = false }: IGenerateIconOptions = {}
) {
  const Icon: IIconComponentType = (props: IIconBaseProps) => {
    return (
      <IconBase {...props}>
        {/* Passing fill={undefined} would override the svg's own fill="none", so omit it. */}
        <IconComponent {...(multiColor ? {} : { fill: 'currentColor' })} />
      </IconBase>
    );
  };
  return Icon;
}