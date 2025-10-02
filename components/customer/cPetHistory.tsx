
interface C_PetHistoryProps {
    petId: number;
}

export default function C_PetHistory({petId} : C_PetHistoryProps) {
    return (
        <>
            pet history page {petId}
        </>
    );
}