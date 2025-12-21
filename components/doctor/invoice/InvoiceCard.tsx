import Image from "next/image";

interface InvoiceCardProps {
  date: string;
  patient: string;
  invoiceId: string;
  total: string;
}

const InvoiceCard = ({ date, patient, invoiceId, total }: InvoiceCardProps) => {
  return (
    <div>
      <div>
        <div>Thu</div>
        <div>15</div>
      </div>
      <Image width={1} height={68} alt="separator" src="/separator.png" />
      <div>
        <div>
          <Image width={20} height={20} alt="user icon" src="/user.png" />
          <div>{patient}</div>
        </div>
        <div>
          <Image width={20} height={20} alt="clock icon" src="/clock.png" />
          <div>{date}</div>
        </div>
        <div>
          <Image width={24} height={24} alt="wallet icon" src="/wallet.png" />
          <div>{invoiceId}</div>
        </div>
        <div>
          <div>Total: {total}</div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceCard;
