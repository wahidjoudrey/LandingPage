
// Function to toggle submenu visibility
function toggleSubmenu(parentId) {
    const parent = document.getElementById(parentId);
    if (parent) {
        parent.classList.toggle('collapsed');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const providerDirectoryParent = document.getElementById('provider-directory-parent');
    if (providerDirectoryParent) {
        providerDirectoryParent.classList.add('collapsed');
      
    }
    const Formularyparent = document.getElementById('Formulary-parent');
    if (Formularyparent) {
        Formularyparent.classList.add('collapsed');
      
    }
    const PatientAccessRule = document.getElementById('PatientAccessRule-parent');
    if (PatientAccessRule) {
        PatientAccessRule.classList.add('collapsed');
      
    }

}); 

