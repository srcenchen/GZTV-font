import { Skeleton, SkeletonItem } from "@fluentui/react-components/unstable";

/**
 * 加载占位组件
 */
function Skeletons() {
  return (
    <Skeleton>
      <SkeletonItem />
      <br />
      <SkeletonItem />
      <br />
      <SkeletonItem />
    </Skeleton>
  );
}

export default Skeletons;
