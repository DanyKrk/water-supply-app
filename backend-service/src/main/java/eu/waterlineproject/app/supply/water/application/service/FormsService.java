package eu.waterlineproject.app.supply.water.application.service;

import eu.waterlineproject.app.supply.water.application.exception.DuplicateEntityException;
import eu.waterlineproject.app.supply.water.application.exception.EntityNotFoundException;
import eu.waterlineproject.app.supply.water.model.forms.FormEntity;
import eu.waterlineproject.app.supply.water.model.forms.FormsRepository;
import eu.waterlineproject.app.supply.water.model.spot.SpotEntity;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@AllArgsConstructor
@Service
@Transactional
@Slf4j
public class FormsService {

    private final FormsRepository formsRepository;

    private final SpotService spotService;

    public Page<FormEntity> getAllForms(Pageable pageable) {
        return formsRepository.findAll(pageable);
    }

    public List<FormEntity> getAllForms() {
        return formsRepository.findAll();
    }

    public List<FormEntity> getAllFormsByIds(List<UUID> ids) {
        return formsRepository.findAllById(ids);
    }

    public List<FormEntity> getAllFormsBySpotId(UUID spotId) throws EntityNotFoundException {
        SpotEntity spot = spotService.getSpotById(spotId);

        return spot.getSelectedFormIds() == null ? new ArrayList<>() : formsRepository.findAllById(spot.getSelectedFormIds());
    }

    public FormEntity getFormById(UUID id) throws EntityNotFoundException {
        return formsRepository.findById(id).orElseThrow(EntityNotFoundException::new);
    }

    public void deleteFormById(UUID id) {
        formsRepository.deleteById(id);
    }

    public void deleteAllForms() {
        formsRepository.deleteAll();
    }

    public boolean existsById(UUID id) {
        return formsRepository.existsById(id);
    }

    public FormEntity addForm(FormEntity entity) throws DuplicateEntityException {
        try {
            return formsRepository.save(entity);
        } catch (DataIntegrityViolationException e) {
            if (e.getCause() instanceof com.mongodb.MongoWriteException) {
                throw new DuplicateEntityException("Form for given name already exists");
            } else {
                throw e;
            }
        }
    }

    public FormEntity updateForm(UUID id, FormEntity entity) throws EntityNotFoundException {
        Optional<FormEntity> optForm = formsRepository.findById(id);
        FormEntity form = optForm.orElseThrow(() -> new EntityNotFoundException("Form not found"));
        form.setName(entity.getName());
        form.setParameters(entity.getParameters());
        return formsRepository.save(form);
    }
}
