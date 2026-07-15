interface LoadingSpinnerProps {
  label?: string;
}

export default function LoadingSpinner({ label = 'Loading products...' }: LoadingSpinnerProps) {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-3" role="status">
      <div className="spinner-border text-primary" aria-hidden="true" />
      <span className="mt-2 small text-muted">{label}</span>
    </div>
  );
}
