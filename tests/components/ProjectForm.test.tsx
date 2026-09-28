import { render, screen, fireEvent, act } from '@/tests/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ProjectForm from '@/components/admin/ProjectForm';

describe('ProjectForm Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.localStorage.clear();
  });

  it('renders form fields with default empty values', () => {
    render(
      <ProjectForm
        saving={false}
        formError={null}
        draftKey="test-draft"
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />
    );

    expect(screen.getByPlaceholderText('Nama project')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Satu-dua kalimat menjelaskan project')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Simpan project/i })).toBeInTheDocument();
  });

  it('shows validation errors when submitting empty required fields', async () => {
    const handleSubmit = vi.fn();
    render(
      <ProjectForm
        saving={false}
        formError={null}
        draftKey="test-draft"
        onSubmit={handleSubmit}
        onCancel={vi.fn()}
      />
    );

    const submitBtn = screen.getByRole('button', { name: /Simpan project/i });
    await act(async () => {
      fireEvent.click(submitBtn);
    });

    expect(screen.getByText('Title wajib diisi.')).toBeInTheDocument();
    expect(screen.getByText('Description wajib diisi.')).toBeInTheDocument();
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('submits valid form values successfully', async () => {
    const handleSubmit = vi.fn();
    render(
      <ProjectForm
        initial={{ title: 'Test Project', description: 'Test Description' }}
        saving={false}
        formError={null}
        draftKey="test-draft"
        onSubmit={handleSubmit}
        onCancel={vi.fn()}
      />
    );

    const submitBtn = screen.getByRole('button', { name: /Simpan project/i });
    await act(async () => {
      fireEvent.click(submitBtn);
    });

    expect(handleSubmit).toHaveBeenCalledTimes(1);
    expect(handleSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Test Project',
        description: 'Test Description',
      })
    );
  });

  it('toggles to public preview tab and back to form', async () => {
    render(
      <ProjectForm
        initial={{ title: 'Previewed App', description: 'Just a preview test' }}
        saving={false}
        formError={null}
        draftKey="test-draft"
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />
    );

    const previewTab = screen.getByRole('tab', { name: /Preview publik/i });
    await act(async () => {
      fireEvent.click(previewTab);
    });

    expect(screen.getByText('Previewed App')).toBeInTheDocument();
    expect(screen.getByText('Just a preview test')).toBeInTheDocument();

    const formTab = screen.getByRole('tab', { name: /Form/i });
    await act(async () => {
      fireEvent.click(formTab);
    });

    expect(screen.getByPlaceholderText('Nama project')).toBeInTheDocument();
  });

  it('calls onCancel when Batal button is clicked', async () => {
    const handleCancel = vi.fn();
    render(
      <ProjectForm
        saving={false}
        formError={null}
        draftKey="test-draft"
        onSubmit={vi.fn()}
        onCancel={handleCancel}
      />
    );

    const cancelBtn = screen.getByRole('button', { name: /Batal/i });
    await act(async () => {
      fireEvent.click(cancelBtn);
    });

    expect(handleCancel).toHaveBeenCalledTimes(1);
  });
});
