package com.base.ods.services.impl;

import com.base.ods.domain.Zone;
import com.base.ods.exception.EntityNotFoundException;
import com.base.ods.exception.MethodNotAllowedException;
import com.base.ods.mapper.ZoneEntityToDTOMapper;
import com.base.ods.repository.ZoneRepository;
import com.base.ods.services.IUserService;
import com.base.ods.services.IZoneService;
import com.base.ods.services.requests.ZoneCreateRequestDTO;
import com.base.ods.services.requests.ZoneUpdateRequestDTO;
import com.base.ods.services.responses.ZoneDeleteResponseDTO;
import com.base.ods.services.responses.ZoneResponseDTO;
import com.base.ods.util.IdWrapper;
import com.base.ods.util.constants.Messages;
import lombok.extern.log4j.Log4j2;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;

@Service
@Log4j2
public class ZoneServiceImpl implements IZoneService {
    private ZoneRepository zoneRepository;
    private IUserService userService;
    private ZoneEntityToDTOMapper mapper;

    public ZoneServiceImpl(ZoneRepository zoneRepository, @Lazy IUserService userService, ZoneEntityToDTOMapper mapper) {
        this.zoneRepository = zoneRepository;
        this.userService = userService;
        this.mapper = mapper;
    }

    @Override
    public List<ZoneResponseDTO> getAllZones() {
        List<Zone> zoneList = zoneRepository.findAll();
        return mapper.toDTOList(zoneList);
    }

    @Override
    public ZoneResponseDTO getZoneById(Long id) {
        Zone zone = zoneRepository.findById(id).orElseThrow(() -> new EntityNotFoundException(Messages.ZONE_NOT_FOUND + id));
        return mapper.toDTO(zone);
    }

    @Override
    public ZoneResponseDTO createZone(ZoneCreateRequestDTO zoneCreateRequestDTO) {
        Zone toSave = mapper.toEntity(zoneCreateRequestDTO);
        Zone result = zoneRepository.save(toSave);
        return mapper.toDTO(result);
    }

    @Override
    public ZoneResponseDTO updateZone(ZoneUpdateRequestDTO zoneUpdateRequestDTO) {
        Zone zone = zoneRepository.findById(zoneUpdateRequestDTO.getId()).orElseThrow(() -> new EntityNotFoundException(Messages.ZONE_NOT_FOUND + zoneUpdateRequestDTO.getId()));
        Zone toUpdate = mapper.toEntity(zoneUpdateRequestDTO);
        Zone result = zoneRepository.save(toUpdate);
        return mapper.toDTO(result);
    }

    @Override
    @Transactional
    public ZoneDeleteResponseDTO deleteZonesByIds(IdWrapper ids) {
        ZoneDeleteResponseDTO response = new ZoneDeleteResponseDTO();

        for (int i = 0; i < ids.getIds().size(); i++) {
            if (!zoneRepository.existsById(ids.getIds().get(i))) {
                response.setMessage("Zone with Id " + ids.getIds().get(i) + " not found");
                response.setStatus("FAIL");
                return response;
            }
            if (userService.zoneExists(ids.getIds().get(i))) {
                response.setMessage("Zone with Id " + ids.getIds().get(i) + " cannot be deleted");
                response.setStatus("FAIL");
                return response;
            }
        }
        
        zoneRepository.deleteByIdIn(ids.getIds());

        response.setMessage("Zones deleted successfully");
        response.setStatus("SUCCESS");

        return response;
    }
}
