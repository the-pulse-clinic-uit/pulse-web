import Image from "next/image";

const StatusTabs = () => {
  return (
    <div>
      <div>Paid</div>
      <div>Unpaid</div>
      <div>
        <Image width={16} height={16} alt="arrow down" src="/arrow-down.png" />
      </div>
    </div>
  );
};

export default StatusTabs;
