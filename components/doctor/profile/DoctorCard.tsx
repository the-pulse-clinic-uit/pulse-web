import Image from "next/image";

export default function DoctorCard() {
  return (
    <div>
      <div />

      <div>
        <div>
          <div>
            <div>
              <Image
                src="/images/avatar.png"
                alt="Doctor avatar"
                width={100}
                height={100}
              />
              <Image
                src="/images/border.png"
                alt="Avatar border"
                width={78}
                height={78}
              />
            </div>
          </div>

          <div>
            <div>Nguyen Van A</div>
            <div>Doctor</div>
          </div>
        </div>

        <div>
          <div>Edit</div>
          <Image src="/icons/edit.svg" alt="Edit icon" width={18} height={18} />
        </div>
      </div>
    </div>
  );
}
