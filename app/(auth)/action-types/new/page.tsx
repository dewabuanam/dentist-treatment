import ActionTypeForm from "../action-type-form"

export default function NewActionTypePage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Tambah Jenis Tindakan</h2>
        <p className="text-muted-foreground">Tambahkan jenis tindakan dokter gigi baru</p>
      </div>

      <ActionTypeForm />
    </div>
  )
}
